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