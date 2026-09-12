"use client";

import { useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import {
    Barlow_Condensed,
    Geist,
    Space_Mono,
} from "next/font/google";

import MedicalAndTerms from "../../components/medicalAndTerms";

const barlow = Barlow_Condensed({
    subsets: ["latin"],
    weight: ["600", "700"],
    variable: "--font-barlow",
});

const geist = Geist({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--font-geist",
});

const spaceMono = Space_Mono({
    subsets: ["latin"],
    weight: ["700"],
    variable: "--font-space-mono",
});

function onlyNumbers(value) {
    return value.replace(/\D/g, "");
}

function maskCPF(value) {
    const numbers = onlyNumbers(value).slice(0, 11);

    return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskRG(value) {
    const characters = value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 9);

    return characters
        .replace(/(\w{2})(\w)/, "$1.$2")
        .replace(/(\w{3})(\w)/, "$1.$2")
        .replace(/(\w{3})(\w)$/, "$1-$2");
}

function maskPhone(value) {
    const numbers = onlyNumbers(value).slice(0, 11);

    if (numbers.length <= 2) {
        return numbers;
    }

    if (numbers.length <= 7) {
        return numbers.replace(
            /(\d{2})(\d+)/,
            "($1) $2"
        );
    }

    return numbers.replace(
        /(\d{2})(\d)(\d{4})(\d{1,4})/,
        "($1) $2.$3-$4"
    );
}

function maskCEP(value) {
    const numbers = onlyNumbers(value).slice(0, 8);

    return numbers.replace(
        /(\d{5})(\d)/,
        "$1-$2"
    );
}

function maskBirthDate(value) {
    const numbers = onlyNumbers(value).slice(0, 8);

    return numbers
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d)/, "$1/$2");
}

function isValidCPF(cpf) {
    const numbers = onlyNumbers(cpf);

    if (numbers.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(numbers)) {
        return false;
    }

    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum += Number(numbers[i]) * (10 - i);
    }

    let digit = (sum * 10) % 11;

    if (digit === 10) {
        digit = 0;
    }

    if (digit !== Number(numbers[9])) {
        return false;
    }

    sum = 0;

    for (let i = 0; i < 10; i++) {
        sum += Number(numbers[i]) * (11 - i);
    }

    digit = (sum * 10) % 11;

    if (digit === 10) {
        digit = 0;
    }

    return digit === Number(numbers[10]);
}

export default function CheckoutPage() {
    const [payment, setPayment] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const methods = useForm({
        defaultValues: {
            name: "",
            cpf: "",
            rg: "",
            cep: "",
            street: "",
            number: "",
            neighborhood: "",
            city: "",

            email: "",
            phone: "",
            birthDate: "",
            emergency: "",

            useMedication: false,
            useMedicationDescription: "",

            healthProblem: false,
            healthProblemDescription: "",

            foodRestriction: false,
            foodRestrictionDescription: "",

            acceptTheTerms: false,

            payment: ""
        },
    });

    const {
        handleSubmit,
        setValue,
    } = methods;

    async function handleCheckout(data) {
        if (processing || success) return;

        try {
            setProcessing(true);

            const response = await fetch("/api/registrations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseText = await response.text();

            let result = {};

            if (responseText) {
                try {
                    result = JSON.parse(responseText);
                } catch (error) {
                    console.error(
                        "Resposta da API não é um JSON válido:",
                        responseText
                    );

                    throw new Error(
                        "O servidor retornou uma resposta inválida."
                    );
                }
            }

            if (!response.ok) {
                throw new Error(
                    result.error ||
                    "Não foi possível realizar a inscrição."
                );
            }

            console.log("Inscrição criada:", result.data);

            setSuccess(true);

            setTimeout(() => {
                window.location.href = `https://api.whatsapp.com/send?phone=5511944593068&text=Eu%20acabei%20de%20me%20inscrever%20no%20mochileiros%20e%20gostaria%20de%20efetuar%20o%20pagamento%20via%20${payment}`;
            }, 3000);

        } catch (error) {
            console.error(
                "Erro ao finalizar inscrição:",
                error
            );

            alert(error.message);
        } finally {
            setProcessing(false);
        }
    }

    function goBack() {
        window.history.back();
    }

    function handlePayment(method) {
        setPayment(method);

        setValue("payment", method, {
            shouldDirty: true,
            shouldValidate: true,
        });
    }

    return (
        <div
            className={`${barlow.variable} ${geist.variable} ${spaceMono.variable} min-h-screen bg-[#131317] text-[#e4e1e7]`}
        >
            {/* HEADER */}
            <header className="fixed top-0 z-50 w-full bg-[#131317]/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
                <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-2">
                        <button
                            type="button"
                            aria-label="Voltar"
                            onClick={goBack}
                            className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg bg-[#2a292e]/60 text-[#e4e1e7] transition-colors hover:bg-[#39393d]"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                close
                            </span>
                        </button>

                        <div className="flex min-w-0 flex-col justify-center">
                            <div className="flex items-center gap-1.5 truncate font-[family-name:var(--font-space-mono)] text-[9px] font-bold uppercase tracking-widest text-[#e0c0af]">
                                <span className="text-[#ff7a00]">
                                    PRE-ORDER
                                </span>

                                <span className="opacity-40">/</span>

                                <span className="text-[#4fdbcc]">
                                    INSCRIÇÃO
                                </span>
                            </div>

                            <h1 className="truncate font-[family-name:var(--font-barlow)] text-xl font-semibold uppercase tracking-wide leading-tight">
                                Pre-order Mochileiros 3.0
                            </h1>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <img
                            alt="Profile"
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-[#584235]/30"
                            src="https://lh3.googleusercontent.com/aida/AEtjO1VATs1vEYtQA-aUQFOeePpNUr0ca-LoPr3DjqZ0vod1wXr0dyyfM2SUIzi8WE2YGAQArFW7uH2Z-Vl2ThCjVq7n8J-sFyaNH_uHblnEJI6iA08EgTgnCKKxXKfr5Sda2JJQza9YnFVul4q7837H7AIT2nVqIJE_HDsUH0RqKOgeFVof76cENniQql4TCapiPnuDxNfV5Z0dtj_tZWf6rHBz1QZ6iCGGy3nz4KnhrMMwWzM8yGbxBDg5zFG7Zy32SVImLLkGp4SKBEI"
                        />
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="min-h-screen bg-[#131317] px-4 pb-8 pt-24 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">

                    {/* STATUS */}
                    <section className="relative overflow-hidden rounded-xl bg-[#1b1b1f] p-4 shadow-md sm:p-6">
                        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#ff7a00]/10 blur-2xl" />

                        <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff7a00]/15 px-3 py-1 font-[family-name:var(--font-space-mono)] text-[9px] font-bold uppercase tracking-wider text-[#ffb68b]">
                                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#ff7a00]" />
                                PRÉ-VENDA EXCLUSIVA
                            </span>
                        </div>

                        <div className="space-y-1">
                            <h2 className="font-[family-name:var(--font-barlow)] text-[38px] font-bold uppercase leading-none tracking-tight sm:text-5xl md:text-6xl">
                                GARANTA SUA VAGA
                            </h2>

                            <p className="font-[family-name:var(--font-geist)] text-lg font-semibold italic text-[#e0b6ff]">
                                Mochileiros 3.0
                            </p>
                        </div>
                    </section>

                    {/* FORM */}
                    <FormProvider {...methods}>
                        <form
                            onSubmit={handleSubmit(handleCheckout)}
                            className="flex flex-col gap-6"
                        >

                            {/* DADOS PESSOAIS */}
                            <section className="space-y-4 rounded-xl bg-[#1b1b1f] p-4 shadow-md sm:p-6">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#4fdbcc]" />

                                        <h3 className="font-[family-name:var(--font-space-mono)] text-xs font-bold uppercase tracking-wider">
                                            1. Dados Pessoais
                                        </h3>
                                    </div>

                                    <span className="font-[family-name:var(--font-space-mono)] text-[9px] font-bold uppercase text-[#e0c0af]">
                                        PASSO 1 DE 4
                                    </span>
                                </div>

                                <InputField
                                    id="name"
                                    label="Nome Completo"
                                    placeholder="ex: Gabriel Fontana"
                                    icon="badge"
                                />

                                <InputField
                                    id="cpf"
                                    label="CPF - Identidade"
                                    placeholder="ex: 000.000.000-00"
                                    icon="id_card"
                                />

                                <InputField
                                    id="rg"
                                    label="RG - Identidade"
                                    placeholder="ex: 00.000.000-0"
                                    icon="id_card_2"
                                />

                                <InputField
                                    id="cep"
                                    label="CEP - Endereço"
                                    placeholder="ex: 00000-000"
                                    icon="explore_nearby"
                                />

                                <InputField
                                    id="street"
                                    label="Rua - Endereço"
                                    placeholder="ex: Rua de Ouro"
                                    icon="map"
                                    disabled
                                />

                                <InputField
                                    id="number"
                                    label="Número - Endereço"
                                    placeholder="ex: 136"
                                    icon="exposure_zero"
                                />

                                <InputField
                                    id="neighborhood"
                                    label="Bairro - Endereço"
                                    placeholder="ex: Paraíso"
                                    icon="holiday_village"
                                    disabled
                                />

                                <InputField
                                    id="city"
                                    label="Cidade - Endereço"
                                    placeholder="ex: São Paulo"
                                    icon="location_city"
                                    disabled
                                />
                            </section>

                            {/* CONTATO */}
                            <section className="space-y-4 rounded-xl bg-[#1b1b1f] p-4 shadow-md sm:p-6">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#e0b6ff]" />

                                        <h3 className="font-[family-name:var(--font-space-mono)] text-xs font-bold uppercase tracking-wider">
                                            2. Contato
                                        </h3>
                                    </div>

                                    <span className="font-[family-name:var(--font-space-mono)] text-[9px] font-bold uppercase text-[#e0c0af]">
                                        PASSO 2 DE 4
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <InputField
                                        id="email"
                                        label="Email"
                                        placeholder="ex: exemplo@dominio.com"
                                        icon="alternate_email"
                                    />

                                    <InputField
                                        id="phone"
                                        label="Celular"
                                        placeholder="ex: (00) 00000-0000"
                                        icon="mobile"
                                    />

                                    <InputField
                                        id="birthDate"
                                        label="Data de Nascimento"
                                        placeholder="ex: 00/00/0000"
                                        icon="date_range"
                                    />

                                    <InputField
                                        id="emergency"
                                        label="Contato de Emergência"
                                        placeholder="Nome e telefone"
                                        icon="emergency"
                                    />
                                </div>
                            </section>

                            {/* SAÚDE */}
                            <section className="space-y-4 rounded-xl bg-[#1b1b1f] p-4 shadow-md sm:p-6">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#e0b6ff]" />

                                        <h3 className="font-[family-name:var(--font-space-mono)] text-xs font-bold uppercase tracking-wider">
                                            3. Saúde e Termos
                                        </h3>
                                    </div>

                                    <span className="font-[family-name:var(--font-space-mono)] text-[9px] font-bold uppercase text-[#e0c0af]">
                                        PASSO 3 DE 4
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <MedicalAndTerms />
                                </div>
                            </section>

                            {/* PAGAMENTO */}
                            <section className="rounded-xl bg-[#1b1b1f] p-4 shadow-md sm:p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#4fdbcc]" />

                                        <h3 className="font-[family-name:var(--font-space-mono)] text-xs font-bold uppercase tracking-wider">
                                            4. Pagamento
                                        </h3>
                                    </div>

                                    <span className="font-[family-name:var(--font-space-mono)] text-[9px] font-bold uppercase text-[#e0c0af]">
                                        PASSO 4 DE 4
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {["PIX", "CARTÃO"].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() =>
                                                handlePayment(method)
                                            }
                                            className={`rounded-xl bg-[#1f1f23] p-4 text-left font-[family-name:var(--font-space-mono)] text-xs font-bold uppercase transition-all ${payment === method
                                                ? "ring-1 ring-[#4fdbcc]"
                                                : "hover:bg-[#2a292e]"
                                                }`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* CTA */}
                            <div className="space-y-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={processing || success}
                                    className={`flex h-14 w-full items-center justify-center gap-2 rounded-xl font-[family-name:var(--font-barlow)] text-xl font-semibold uppercase tracking-wider transition-all active:scale-[0.98] disabled:cursor-default ${success
                                        ? "bg-[#00b3a6] text-[#003e39]"
                                        : "bg-[#ff7a00] text-[#522300] shadow-[0_0_24px_rgba(255,122,0,0.5)]"
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[24px]">
                                        {processing
                                            ? "refresh"
                                            : success
                                                ? "task_alt"
                                                : "verified"}
                                    </span>

                                    {processing
                                        ? "PROCESSANDO VAGA..."
                                        : success
                                            ? "VAGA PRÉ-RESERVADA! - Redirecionando para pagamento"
                                            : "Finalizar pré-order"}
                                </button>

                                <div className="rounded-lg bg-[#1b1b1f] p-3">
                                    <div className="flex flex-wrap items-center justify-center gap-4 font-[family-name:var(--font-space-mono)] text-[9px] font-bold uppercase text-[#e0c0af]">
                                        <span>Pré-reserva</span>
                                        <span>•</span>
                                        <span>1º lote</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </main>
        </div>
    );
}

function InputField({
    id,
    label,
    placeholder,
    type = "text",
    icon,
    disabled
}) {
    const {
        register,
        setValue,
        formState: { errors },
    } = useFormContext();

    const validations = {
        name: {
            required: "Informe seu nome completo.",
            minLength: {
                value: 3,
                message: "Informe seu nome completo.",
            },
        },

        cpf: {
            required: "Informe seu CPF.",
            validate: (value) => {
                if (!isValidCPF(value)) {
                    return "Informe um CPF válido.";
                }

                return true;
            },
        },

        rg: {
            required: "Informe seu RG.",
            pattern: {
                value: /^[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}-[A-Z0-9]$/i,
                message: "Informe um RG válido.",
            },
        },

        cep: {
            required: "Informe seu CEP.",
            pattern: {
                value: /^\d{5}-\d{3}$/,
                message: "Informe um CEP válido.",
            },
        },

        street: {
            required: "Informe sua rua.",
            minLength: {
                value: 2,
                message: "Informe uma rua válida.",
            },
        },

        number: {
            required: "Informe o número.",
        },

        neighborhood: {
            required: "Informe seu bairro.",
        },

        city: {
            required: "Informe sua cidade.",
        },

        email: {
            required: "Informe seu e-mail.",
            pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Informe um e-mail válido.",
            },
        },

        phone: {
            required: "Informe seu celular.",
            pattern: {
                value: /^\(\d{2}\) \d\.\d{4}-\d{4}$/,
                message: "Informe um celular válido.",
            },
        },

        birthDate: {
            required: "Informe sua data de nascimento.",
            validate: (value) => {
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                    return "Informe uma data válida.";
                }

                const [day, month, year] = value
                    .split("/")
                    .map(Number);

                const date = new Date(year, month - 1, day);

                const validDate =
                    date.getFullYear() === year &&
                    date.getMonth() === month - 1 &&
                    date.getDate() === day;

                if (!validDate) {
                    return "Informe uma data válida.";
                }

                return true;
            },
        },

        emergency: {
            required: "Informe um contato de emergência.",
            minLength: {
                value: 5,
                message: "Informe um contato de emergência válido.",
            },
        },
    };

    const validation = validations[id];

    const maskFunctions = {
        cpf: maskCPF,
        rg: maskRG,
        cep: maskCEP,
        phone: maskPhone,
        birthDate: maskBirthDate,
        emergency: maskPhone
    };

    const maskFunction = maskFunctions[id];

    const fieldError = errors[id];

    async function searchCEP(value) {
        const numbers = onlyNumbers(value);

        if (numbers.length !== 8) {
            return;
        }

        try {
            const response = await fetch(
                `https://viacep.com.br/ws/${numbers}/json/`
            );

            const data = await response.json();

            if (data.erro) {
                setValue("street", "", { shouldValidate: true });
                setValue("neighborhood", "", { shouldValidate: true });
                setValue("city", "", { shouldValidate: true });

                return;
            }

            setValue("street", data.logradouro || "", {
                shouldValidate: true,
                shouldDirty: true,
            });

            setValue("neighborhood", data.bairro || "", {
                shouldValidate: true,
                shouldDirty: true,
            });

            setValue("city", data.localidade || "", {
                shouldValidate: true,
                shouldDirty: true,
            });
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    }

    return (
        <div className="space-y-1">
            <label
                htmlFor={id}
                className="block font-[family-name:var(--font-space-mono)] text-[11px] font-bold uppercase tracking-wider"
            >
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...register(id, {
                        ...validation,

                        onChange: (event) => {
                            let value = event.target.value;

                            if (maskFunction) {
                                value = maskFunction(value);
                                event.target.value = value;
                            }

                            if (id === "cep") {
                                searchCEP(value);
                            }
                        },
                    })}
                    className={`h-11 w-full rounded-lg bg-[#1f1f23] px-3.5 pr-11 font-[family-name:var(--font-geist)] text-sm text-[#e4e1e7] placeholder:text-[#39393d] focus:bg-[#2a292e] focus:outline-none ${fieldError
                        ? "ring-1 ring-red-500 focus:ring-red-500"
                        : ""
                        }`}
                />

                {icon && (
                    <span
                        className={`material-symbols-outlined absolute right-3 top-3 text-[18px] ${fieldError
                            ? "text-red-400"
                            : "text-[#e0c0af]"
                            }`}
                    >
                        {icon}
                    </span>
                )}
            </div>

            {fieldError && (
                <p className="font-[family-name:var(--font-space-mono)] text-[10px] font-bold text-red-400">
                    {fieldError.message}
                </p>
            )}
        </div>
    );
}

