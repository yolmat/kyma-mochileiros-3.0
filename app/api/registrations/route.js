import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma.js";

export async function POST(request) {
    try {
        const body = await request.json();

        console.log("BODY RECEBIDO:", body);

        const {
            name,
            cpf,
            rg,
            cep,
            street,
            number,
            neighborhood,
            city,
            email,
            phone,
            birthDate,
            emergency,
            useMedication,
            useMedicationDescription,
            healthProblem,
            healthProblemDescription,
            foodRestriction,
            foodRestrictionDescription,
            acceptTheTerms,
            payment,
        } = body;

        if (
            !name ||
            !cpf ||
            !rg ||
            !cep ||
            !street ||
            !number ||
            !neighborhood ||
            !city ||
            !email ||
            !phone ||
            !birthDate ||
            !emergency
        ) {
            return NextResponse.json(
                {
                    error:
                        "Preencha todos os campos obrigatórios.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!acceptTheTerms) {
            return NextResponse.json(
                {
                    error:
                        "Você precisa aceitar os termos.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            payment !== "PIX" &&
            payment !== "CARTÃO"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Forma de pagamento inválida.",
                },
                {
                    status: 400,
                }
            );
        }

        const cleanCpf = cpf.replace(/\D/g, "");
        const cleanCep = cep.replace(/\D/g, "");
        const cleanPhone = phone.replace(/\D/g, "");

        const cleanRg = rg.replace(
            /[.\-\s]/g,
            ""
        );

        const paymentMethod =
            payment === "CARTÃO"
                ? "CARTAO"
                : "PIX";

        const registration =
            await prisma.registration.create({
                data: {
                    name,
                    cpf: cleanCpf,
                    rg: cleanRg,

                    cep: cleanCep,
                    street,
                    number,
                    neighborhood,
                    city,

                    email,
                    phone: cleanPhone,
                    birthDate,
                    emergency,

                    useMedication:
                        Boolean(useMedication),

                    useMedicationDescription:
                        useMedication
                            ? useMedicationDescription || null
                            : null,

                    healthProblem:
                        Boolean(healthProblem),

                    healthProblemDescription:
                        healthProblem
                            ? healthProblemDescription || null
                            : null,

                    foodRestriction:
                        Boolean(foodRestriction),

                    foodRestrictionDescription:
                        foodRestriction
                            ? foodRestrictionDescription || null
                            : null,

                    acceptTheTerms: true,

                    payment: paymentMethod,
                },
            });

        return NextResponse.json(
            {
                message:
                    "Inscrição realizada com sucesso.",
                data: registration,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "ERRO NA API /api/registrations:",
            error
        );

        if (error.code === "P2002") {
            return NextResponse.json(
                {
                    error:
                        "Já existe uma inscrição com este CPF.",
                },
                {
                    status: 409,
                }
            );
        }

        return NextResponse.json(
            {
                error:
                    "Erro interno ao realizar a inscrição.",
                details:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET() {
    try {
        const registrations = await prisma.registration.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: registrations,
                total: registrations.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("ERRO NA API GET /api/registrations:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Erro ao buscar inscrições.",
                details:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}

export async function PATCH(request) {
    try {
        const body = await request.json();

        const { id, field, value } = body;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "ID da inscrição não informado.",
                },
                { status: 400 }
            );
        }

        if (!field) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Campo não informado.",
                },
                { status: 400 }
            );
        }

        const allowedFields = [
            "name",
            "cpf",
            "rg",
            "cep",
            "street",
            "number",
            "neighborhood",
            "city",
            "email",
            "phone",
            "birthDate",
            "emergency",
            "useMedication",
            "useMedicationDescription",
            "healthProblem",
            "healthProblemDescription",
            "foodRestriction",
            "foodRestrictionDescription",
            "acceptTheTerms",
            "payment",
            "amountRegistration",
            "amountPaid",
            "statusPayment",
            "datePayment",
        ];

        if (!allowedFields.includes(field)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Campo não permitido para alteração.",
                },
                { status: 400 }
            );
        }

        if (value === undefined) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Valor não informado.",
                },
                { status: 400 }
            );
        }

        let parsedValue = value;

        if (
            field === "amountRegistration" ||
            field === "amountPaid"
        ) {
            parsedValue = Number(value);

            if (Number.isNaN(parsedValue)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Valor monetário inválido.",
                    },
                    { status: 400 }
                );
            }
        }

        if (
            field === "useMedication" ||
            field === "healthProblem" ||
            field === "foodRestriction" ||
            field === "acceptTheTerms"
        ) {
            parsedValue = Boolean(value);
        }

        if (field === "payment") {
            if (value !== "PIX" && value !== "CARTAO") {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Forma de pagamento inválida.",
                    },
                    { status: 400 }
                );
            }
        }

        if (field === "statusPayment") {
            const allowedStatuses = [
                "PENDENTE",
                "PARCIAL",
                "PAGO",
                "CANCELADO",
            ];

            if (!allowedStatuses.includes(value)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Status de pagamento inválido.",
                    },
                    { status: 400 }
                );
            }
        }

        const registration = await prisma.registration.update({
            where: {
                id,
            },
            data: {
                [field]: parsedValue,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Inscrição atualizada com sucesso.",
            data: registration,
        });

    } catch (error) {
        console.error("Erro ao atualizar inscrição:", error);

        if (error.code === "P2025") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Inscrição não encontrada.",
                },
                { status: 404 }
            );
        }

        if (error.code === "P2002") {
            return NextResponse.json(
                {
                    success: false,
                    error: "Já existe uma inscrição com esse valor.",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: "Erro ao atualizar inscrição.",
                details: error.message,
            },
            { status: 500 }
        );
    }

}
