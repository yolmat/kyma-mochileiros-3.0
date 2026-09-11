"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export default function Step2() {
    const {
        register,
        setValue,
        watch,
    } = useFormContext();

    const [showTerms, setShowTerms] = useState(false);

    /*
     * Valores controlados pelo React Hook Form
     */
    const useMedication = watch("useMedication") || false;
    const healthProblem = watch("healthProblem") || false;
    const foodRestriction = watch("foodRestriction") || false;
    const acceptTheTerms = watch("acceptTheTerms") || false;

    /*
     * Atualiza os valores booleanos no React Hook Form.
     */
    function handleCheckbox(field, value) {
        setValue(field, value, {
            shouldValidate: true,
            shouldDirty: true,
        });

        /*
         * Limpa o campo complementar quando
         * o usuário desmarca a opção.
         */
        if (!value) {
            if (field === "useMedication") {
                setValue("useMedicationDescription", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }

            if (field === "healthProblem") {
                setValue("healthProblemDescription", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }

            if (field === "foodRestriction") {
                setValue("foodRestrictionDescription", "", {
                    shouldDirty: true,
                    shouldValidate: true,
                });
            }
        }
    }

    /*
     * Termos
     */
    function handleTermsChange(value) {
        setValue("acceptTheTerms", value, {
            shouldValidate: true,
            shouldDirty: true,
        });

        const currentCheckout = JSON.parse(
            localStorage.getItem("checkout_v2") || "{}"
        );

        localStorage.setItem(
            "checkout_v2",
            JSON.stringify({
                ...currentCheckout,
                acceptTheTerms: value,
            })
        );
    }

    return (
        <>
            <motion.div
                key="step2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
            >
                {/* =====================================================
                    MEDICAMENTOS
                ====================================================== */}

                <HealthCard
                    checked={useMedication}
                    onChange={(value) =>
                        handleCheckbox("useMedication", value)
                    }
                    icon="medication"
                    title="Faz uso de algum medicamento?"
                    description="Marque caso utilize algum medicamento regularmente."
                    color="orange"
                >
                    <div className="space-y-1.5">
                        <label
                            htmlFor="useMedicationDescription"
                            className="block font-[family-name:var(--font-space-mono)] text-[10px] font-bold uppercase tracking-wider text-[#e0c0af]"
                        >
                            Se sim, qual?
                        </label>

                        <input
                            id="useMedicationDescription"
                            {...register("useMedicationDescription")}
                            placeholder="Ex.: Dipirona, Insulina..."
                            className="w-full rounded-xl border border-[#353439] bg-[#151518] px-4 py-3 text-sm text-[#e4e1e7] outline-none transition placeholder:text-[#77747c] focus:border-[#ff7a00]"
                        />
                    </div>
                </HealthCard>

                {/* =====================================================
                    PROBLEMA DE SAÚDE
                ====================================================== */}

                <HealthCard
                    checked={healthProblem}
                    onChange={(value) =>
                        handleCheckbox("healthProblem", value)
                    }
                    icon="medical_information"
                    title="Tem algum problema de saúde?"
                    description="Informe caso exista alguma condição importante."
                    color="purple"
                >
                    <div className="space-y-1.5">
                        <label
                            htmlFor="healthProblemDescription"
                            className="block font-[family-name:var(--font-space-mono)] text-[10px] font-bold uppercase tracking-wider text-[#e0c0af]"
                        >
                            Se sim, qual?
                        </label>

                        <input
                            id="healthProblemDescription"
                            {...register("healthProblemDescription")}
                            placeholder="Ex.: Asma, Hipertensão..."
                            className="w-full rounded-xl border border-[#353439] bg-[#151518] px-4 py-3 text-sm text-[#e4e1e7] outline-none transition placeholder:text-[#77747c] focus:border-[#e0b6ff]"
                        />
                    </div>
                </HealthCard>

                {/* =====================================================
                    RESTRIÇÃO ALIMENTAR
                ====================================================== */}

                <HealthCard
                    checked={foodRestriction}
                    onChange={(value) =>
                        handleCheckbox("foodRestriction", value)
                    }
                    icon="restaurant"
                    title="Alguma restrição alimentar?"
                    description="Informe caso tenha alguma restrição ou alergia alimentar."
                    color="teal"
                >
                    <div className="space-y-1.5">
                        <label
                            htmlFor="foodRestrictionDescription"
                            className="block font-[family-name:var(--font-space-mono)] text-[10px] font-bold uppercase tracking-wider text-[#e0c0af]"
                        >
                            Se sim, qual?
                        </label>

                        <input
                            id="foodRestrictionDescription"
                            {...register("foodRestrictionDescription")}
                            placeholder="Ex.: Lactose, Glúten, Amendoim..."
                            className="w-full rounded-xl border border-[#353439] bg-[#151518] px-4 py-3 text-sm text-[#e4e1e7] outline-none transition placeholder:text-[#77747c] focus:border-[#4fdbcc]"
                        />
                    </div>
                </HealthCard>

                {/* =====================================================
                    TERMOS
                ====================================================== */}

                <section className="rounded-xl bg-[#1b1b1f] p-4 shadow-md sm:p-5">
                    <button
                        type="button"
                        onClick={() =>
                            handleTermsChange(!acceptTheTerms)
                        }
                        className="flex w-full items-start gap-3 text-left"
                    >
                        {/* Checkbox */}
                        <span
                            className={`mt - 0.5 flex h - 5 w - 5 shrink - 0 items - center justify - center rounded - md border transition - all ${acceptTheTerms
                                ? "border-[#ff7a00] bg-[#ff7a00] text-[#522300]"
                                : "border-[#584235] bg-[#1f1f23]"
                                } `}
                        >
                            {acceptTheTerms && (
                                <span className="material-symbols-outlined text-[15px]">
                                    check
                                </span>
                            )}
                        </span>

                        <span className="min-w-0 font-[family-name:var(--font-geist)] text-sm leading-6 text-[#e0c0af]">
                            Aceito os Termos e Condições de Participação no
                            Retiro Mochileiros.
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowTerms(true)}
                        className="ml-8 mt-2 font-[family-name:var(--font-space-mono)] text-[10px] font-bold uppercase tracking-wider text-[#ffb68b] underline underline-offset-4 transition-colors hover:text-[#ff7a00]"
                    >
                        Ler termos e condições
                    </button>

                    {!acceptTheTerms && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 flex items-center gap-2 rounded-lg bg-[#ff7a00]/10 px-3 py-2.5 text-xs text-[#ffb68b]"
                        >
                            <span className="material-symbols-outlined text-[17px]">
                                warning
                            </span>

                            <span>
                                Você precisa aceitar os termos para continuar.
                            </span>
                        </motion.div>
                    )}
                </section>
            </motion.div>

            {/* =======================================================
                MODAL DOS TERMOS
            ======================================================== */}

            <AnimatePresence>
                {showTerms && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                        onClick={() => setShowTerms(false)}
                    >
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.96,
                                y: 20,
                            }}
                            transition={{
                                duration: 0.2,
                            }}
                            onClick={(event) => event.stopPropagation()}
                            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#353439] bg-[#1b1b1f] shadow-2xl"
                        >
                            {/* Modal Header */}

                            <div className="flex shrink-0 items-center justify-between border-b border-[#353439] px-4 py-4 sm:px-6">
                                <div>
                                    <span className="font-[family-name:var(--font-space-mono)] text-[9px] font-bold uppercase tracking-widest text-[#ff7a00]">
                                        DOCUMENTO
                                    </span>

                                    <h2 className="mt-1 font-[family-name:var(--font-barlow)] text-2xl font-bold uppercase leading-none text-[#e4e1e7] sm:text-3xl">
                                        Termos e Condições
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowTerms(false)}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2a292e] text-[#e0c0af] transition-colors hover:bg-[#353439] hover:text-white"
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        close
                                    </span>
                                </button>
                            </div>

                            {/* Modal Content */}

                            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                                <div className="rounded-lg bg-[#0e0e12] p-4 sm:p-5">
                                    <div className="whitespace-pre-line font-[family-name:var(--font-geist)] text-sm leading-6 text-[#e0c0af]">
                                        {TERMS}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}

                            <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-[#353439] p-4 sm:flex-row sm:justify-end sm:p-5">
                                <button
                                    type="button"
                                    onClick={() => setShowTerms(false)}
                                    className="h-11 rounded-lg border border-[#353439] bg-[#1f1f23] px-5 font-[family-name:var(--font-space-mono)] text-[10px] font-bold uppercase tracking-wider text-[#e0c0af] transition-colors hover:bg-[#2a292e]"
                                >
                                    Fechar
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        handleTermsChange(true);
                                        setShowTerms(false);
                                    }}
                                    className="h-11 rounded-lg bg-[#ff7a00] px-5 font-[family-name:var(--font-space-mono)] text-[10px] font-bold uppercase tracking-wider text-[#522300] shadow-[0_0_16px_rgba(255,122,0,0.25)] transition-all hover:brightness-110 active:scale-[0.98]"
                                >
                                    Li e Aceito →
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ============================================================
   CARD DE INFORMAÇÃO
============================================================ */

function HealthCard({
    checked,
    onChange,
    icon,
    title,
    description,
    color,
    children,
}) {
    const colors = {
        orange: {
            dot: "bg-[#ff7a00]",
            icon: "bg-[#ff7a00]/15 text-[#ff7a00]",
        },
        purple: {
            dot: "bg-[#e0b6ff]",
            icon: "bg-[#e0b6ff]/15 text-[#e0b6ff]",
        },
        teal: {
            dot: "bg-[#4fdbcc]",
            icon: "bg-[#4fdbcc]/15 text-[#4fdbcc]",
        },
    };

    const theme = colors[color];

    return (
        <section
            className={`rounded - xl bg - [#1b1b1f] p - 4 shadow - md transition - all duration - 300 sm: p - 5 ${checked ? "ring-1 ring-[#353439]" : ""
                } `}
        >
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className="flex w-full items-start gap-3 text-left"
            >
                {/* Checkbox */}

                <span
                    className={`mt - 0.5 flex h - 5 w - 5 shrink - 0 items - center justify - center rounded - md border transition - all ${checked
                        ? "border-[#ff7a00] bg-[#ff7a00] text-[#522300]"
                        : "border-[#584235] bg-[#1f1f23]"
                        } `}
                >
                    {checked && (
                        <span className="material-symbols-outlined text-[15px]">
                            check
                        </span>
                    )}
                </span>

                {/* Conteúdo */}

                <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                        <div
                            className={`flex h - 9 w - 9 shrink - 0 items - center justify - center rounded - lg ${theme.icon} `}
                        >
                            <span className="material-symbols-outlined text-[19px]">
                                {icon}
                            </span>
                        </div>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`h - 1.5 w - 1.5 shrink - 0 rounded - full ${theme.dot} `}
                                />

                                <h3 className="font-[family-name:var(--font-geist)] text-sm font-semibold text-[#e4e1e7] sm:text-base">
                                    {title}
                                </h3>
                            </div>

                            <p className="mt-1 text-xs leading-5 text-[#e0c0af] sm:text-sm">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
            </button>

            {/* Input condicional */}

            <AnimatePresence initial={false}>
                {checked && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            height: 0,
                        }}
                        animate={{
                            opacity: 1,
                            height: "auto",
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="overflow-hidden"
                    >
                        <div className="ml-8 mt-4 border-l border-[#353439] pl-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

/* ============================================================
   TERMOS
============================================================ */

const TERMS = `
Termos e Condições de Participação no Retiro Mochileiros

I.PRIVACIDADE

Seus dados de contato serão utilizados para compilar a lista de participantes, que poderá ser utilizada para:

• Cadastro na base de dados dos participantes;

• Envio de e - mail de avisos, envio do passaporte e também de marketing aos participantes, com o objetivo de informação, contato e prospecção.

    II.FOTOGRAFIA E GRAVAÇÃO

Ao participar do Evento, você estará sujeito a filmagem e / ou fotografia, o que autoriza e concede ao Retiro Mochileiros, irrevogavelmente, o direito de:

• Gravar e / ou registrar foto e voz com o emprego de recursos de fotografia e filmagem para produção de mídia audiovisual, bem como empregar a identificação de seu nome e outras informações sobre a sua pessoa enquanto participante deste evento, para a produção da mídia em questão;

• Apresentar no evento e / ou divulgar as informações citadas anteriormente de forma on - line, inclusive nas mídias sociais.

Dessa forma, por meio deste Termo, você:

• Reconhece que o Retiro Mochileiros possui e deve possuir todos os direitos, títulos e interesses, incluindo direitos autorais, destes registros;

• Reconhece ainda que o Retiro Mochileiros não é obrigado a usar estes registros;

• Entende que não receberá nenhum tipo de remuneração por estes registros.

    III.AVISO LEGAL

No momento da sua inscrição, o Retiro Mochileiros assegura que forneceu as informações mais recentes disponíveis sobre os termos e condições de participação no evento.

O Retiro Mochileiros se reserva o direito de atualizar os Termos e Condições de Participação no Evento sem aviso prévio, cabendo ao participante consultar a regra vigente por meio de contato com a organização.

Durante a realização do evento, o Retiro Mochileiros não poderá controlar todo o conteúdo publicado ou disseminado por outros.

Você é o único responsável pela sua conduta, comportamento e eventual interação durante o evento, de modo que concorda em agir com responsabilidade, cautela, bom senso e segurança enquanto estiver presente em qualquer atividade, dinâmicas e cultos, preservando a ética e os bons costumes das relações.

O Retiro Mochileiros, sua equipe de trabalho e o dono do espaço do evento não serão responsáveis por quaisquer perdas ou danos.

    IV.CADASTRO REALIZADO POR TERCEIROS

Se outra pessoa se registrar em seu nome, cabe ao responsável notificá - la dos termos e condições do registro, pelos quais concorda em nome do participante.

O passaporte é individual e intransferível.Cada ingresso deve ser acompanhado de sua ficha de inscrição individual.

O Retiro Mochileiros não se responsabiliza por cadastros realizados por terceiros em seu nome.No entanto, caso identifique que alguém se cadastrou no evento utilizando os seus dados pessoais, entre em contato com a equipe de trabalho pelo e - mail triakyma @gmail.com para informar o caso.

    V.CANCELAMENTO

Todos os pedidos de cancelamento de registro no evento devem ser notificados ao Retiro Mochileiros, por escrito, enviando um e - mail para triakyma @gmail.com.

Os pedidos de cancelamento recebidos só passarão a ser processados após você receber uma confirmação de registro por e - mail do Retiro Mochileiros.

Se você não receber uma confirmação dentro de dois(2) dias úteis, por favor entre em contato com a organização.

Se o pedido de cancelamento não for recebido por escrito, o registro não será cancelado.

De acordo com nossos Termos de Serviço e com o CDC(Código de Defesa do Consumidor), a solicitação de cancelamento pode ser feita em até sete(7) dias corridos após a compra, desde que seja antes de 48 horas do evento.

Após os sete(7) dias ou após quarenta e oito(48) horas antes do evento, NÃO HAVERÁ REEMBOLSO.

No caso de reagendamento da data do evento, os passaportes serão mantidos com os mesmos valores.

Caso o(a) participante opte pelo cancelamento ao invés do reagendamento, o(a) mesmo(a) deverá solicitar nos mesmos prazos acima, contando sete(7) dias após a comunicação oficial da alteração.

Qualquer dúvida ou informação adicional que necessite, entre em contato com a organização: triakyma @gmail.com
    `;

