"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Barlow_Condensed,
    Geist,
    Space_Mono,
} from "next/font/google";

const barlow = Barlow_Condensed({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const geist = Geist({
    subsets: ["latin"],
});

const mono = Space_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});

/* =========================================================
   MASKS
========================================================= */

function onlyNumbers(value = "") {
    return String(value).replace(/\D/g, "");
}

function maskCPF(value = "") {
    const numbers = onlyNumbers(value).slice(0, 11);

    return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskRG(value = "") {
    const characters = String(value)
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 9);

    return characters
        .replace(/(\w{2})(\w)/, "$1.$2")
        .replace(/(\w{3})(\w)/, "$1.$2")
        .replace(/(\w{3})(\w)$/, "$1-$2");
}

function maskPhone(value = "") {
    const numbers = onlyNumbers(value).slice(0, 11);

    if (numbers.length <= 2) {
        return numbers;
    }

    if (numbers.length <= 7) {
        return numbers.replace(/(\d{2})(\d+)/, "($1) $2");
    }

    return numbers.replace(
        /(\d{2})(\d)(\d{4})(\d{1,4})/,
        "($1) $2.$3-$4"
    );
}

function maskCEP(value = "") {
    const numbers = onlyNumbers(value).slice(0, 8);

    return numbers.replace(/(\d{5})(\d)/, "$1-$2");
}

function maskBirthDate(value = "") {
    const numbers = onlyNumbers(value).slice(0, 8);

    return numbers
        .replace(/(\d{2})(\d)/, "$1/$2")
        .replace(/(\d{2})(\d)/, "$1/$2");
}

function formatDate(value) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatDateTime(value) {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({ label, value, accent = "orange" }) {
    const accents = {
        orange: "text-[#ff7a00]",
        purple: "text-[#e0b6ff]",
        teal: "text-[#4fdbcc]",
        white: "text-[#e4e1e7]",
    };

    return (
        <div className="rounded-xl border border-white/6 bg-[#1b1b1f] p-5">
            <p
                className={`${mono.className} text-[10px] uppercase tracking-[0.18em] text-[#e0c0af]/60`}
            >
                {label}
            </p>

            <p
                className={`${barlow.className} mt-2 text-4xl font-semibold tracking-wide ${accents[accent]}`}
            >
                {value}
            </p>
        </div>
    );
}

function PaymentBadge({ payment }) {
    const isPix = payment === "PIX";

    return (
        <span
            className={`
        inline-flex items-center rounded-full border px-2.5 py-1
        ${mono.className}
        text-[9px] font-bold uppercase tracking-wider
        ${isPix
                    ? "border-[#4fdbcc]/20 bg-[#4fdbcc]/10 text-[#4fdbcc]"
                    : "border-[#e0b6ff]/20 bg-[#e0b6ff]/10 text-[#e0b6ff]"
                }
      `}
        >
            {payment || "-"}
        </span>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="border-b border-white/5 py-3 last:border-0">
            <p
                className={`${mono.className} mb-1 text-[9px] uppercase tracking-[0.15em] text-[#e0c0af]/45`}
            >
                {label}
            </p>

            <p className="text-sm text-[#e4e1e7]">
                {value || "-"}
            </p>
        </div>
    );
}

/* =========================================================
   PAGE
========================================================= */

export default function RegistrationsPage() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("TODOS");

    const [selectedRegistration, setSelectedRegistration] =
        useState(null);

    async function loadRegistrations() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch("/api/registrations", {
                method: "GET",
                cache: "no-store",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Não foi possível carregar as inscrições."
                );
            }

            setRegistrations(result.data || []);
        } catch (error) {
            console.error("Erro ao carregar inscrições:", error);
            setError(
                error.message || "Erro ao carregar as inscrições."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRegistrations();
    }, []);

    /* =========================================================
       FILTER
    ========================================================= */

    const filteredRegistrations = useMemo(() => {
        const normalizedSearch = search
            .toLowerCase()
            .trim();

        return registrations.filter((registration) => {
            const matchesPayment =
                paymentFilter === "TODOS" ||
                registration.payment === paymentFilter;

            if (!matchesPayment) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            const name =
                registration.name?.toLowerCase() || "";

            const cpf =
                maskCPF(registration.cpf || "").toLowerCase();

            const phone =
                maskPhone(registration.phone || "").toLowerCase();

            const city =
                registration.city?.toLowerCase() || "";

            return (
                name.includes(normalizedSearch) ||
                cpf.includes(normalizedSearch) ||
                phone.includes(normalizedSearch) ||
                city.includes(normalizedSearch)
            );
        });
    }, [registrations, search, paymentFilter]);

    /* =========================================================
       STATS
    ========================================================= */

    const total = registrations.length;

    const pixCount = registrations.filter(
        (item) => item.payment === "PIX"
    ).length;

    const cardCount = registrations.filter(
        (item) => item.payment === "CARTAO"
    ).length;

    const todayCount = registrations.filter((item) => {
        if (!item.createdAt) return false;

        const created = new Date(item.createdAt);
        const today = new Date();

        return (
            created.getDate() === today.getDate() &&
            created.getMonth() === today.getMonth() &&
            created.getFullYear() === today.getFullYear()
        );
    }).length;

    return (
        <main
            className={`${geist.className} min-h-screen bg-[#131317] text-[#e4e1e7]`}
        >
            <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
                {/* =================================================
            HEADER
        ================================================= */}

                <header className="mb-8 flex flex-col justify-between gap-5 border-b border-white/6 pb-6 md:flex-row md:items-end">
                    <div>
                        <div
                            className={`${mono.className} mb-2 text-[10px] uppercase tracking-[0.25em] text-[#ff7a00]`}
                        >
                            MOCHILEIROS 3.0
                        </div>

                        <h1
                            className={`${barlow.className} text-5xl font-bold uppercase leading-none tracking-wide sm:text-6xl`}
                        >
                            INSCRIÇÕES
                        </h1>

                        <p className="mt-2 text-sm text-[#e0c0af]/65">
                            Visão geral dos participantes da expedição.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadRegistrations}
                        disabled={loading}
                        className={`
              inline-flex h-11 items-center justify-center rounded-lg
              border border-white/8 bg-[#1b1b1f] px-5
              ${mono.className}
              text-[10px] font-bold uppercase tracking-wider
              text-[#e4e1e7]
              transition
              hover:border-[#ff7a00]/40 hover:bg-[#222227]
              disabled:cursor-not-allowed disabled:opacity-50
            `}
                    >
                        {loading ? "ATUALIZANDO..." : "ATUALIZAR DADOS"}
                    </button>
                </header>

                {/* =================================================
            ERROR
        ================================================= */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                        <p className="text-sm text-red-300">
                            {error}
                        </p>
                    </div>
                )}

                {/* =================================================
            STATS
        ================================================= */}

                <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard
                        label="Total de inscrições"
                        value={total}
                        accent="orange"
                    />

                    <StatCard
                        label="Pagamento PIX"
                        value={pixCount}
                        accent="teal"
                    />

                    <StatCard
                        label="Pagamento cartão"
                        value={cardCount}
                        accent="purple"
                    />

                    <StatCard
                        label="Inscrições hoje"
                        value={todayCount}
                        accent="white"
                    />
                </section>

                {/* =================================================
            FILTERS
        ================================================= */}

                <section className="mb-5 rounded-xl border border-white/6 bg-[#1b1b1f] p-4">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Buscar por nome, CPF, telefone ou cidade..."
                                className="
                  h-11 w-full rounded-lg border border-white/7
                  bg-[#131317] px-4
                  text-sm text-[#e4e1e7]
                  outline-none
                  placeholder:text-[#e0c0af]/30
                  focus:border-[#ff7a00]/50
                "
                            />
                        </div>

                        <select
                            value={paymentFilter}
                            onChange={(event) =>
                                setPaymentFilter(event.target.value)
                            }
                            className={`
                h-11 rounded-lg border border-white/7
                bg-[#131317] px-4
                ${mono.className}
                text-[10px] uppercase tracking-wider
                text-[#e4e1e7]
                outline-none
                focus:border-[#ff7a00]/50
              `}
                        >
                            <option value="TODOS">
                                TODOS OS PAGAMENTOS
                            </option>

                            <option value="PIX">
                                PIX
                            </option>

                            <option value="CARTAO">
                                CARTÃO
                            </option>

                            <option value="CARTÃO">
                                CARTÃO
                            </option>
                        </select>
                    </div>
                </section>

                {/* =================================================
            RESULT COUNT
        ================================================= */}

                <div className="mb-3 flex items-center justify-between">
                    <p
                        className={`${mono.className} text-[9px] uppercase tracking-[0.18em] text-[#e0c0af]/45`}
                    >
                        {filteredRegistrations.length}{" "}
                        {filteredRegistrations.length === 1
                            ? "INSCRIÇÃO"
                            : "INSCRIÇÕES"}
                    </p>

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className={`${mono.className} text-[9px] uppercase tracking-wider text-[#ff7a00] hover:underline`}
                        >
                            Limpar busca
                        </button>
                    )}
                </div>

                {/* =================================================
            DESKTOP TABLE
        ================================================= */}

                <section className="hidden overflow-hidden rounded-xl border border-white/6 bg-[#1b1b1f] md:block">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-white/6 bg-white/[0.015]">
                                    <th
                                        className={`${mono.className} px-5 py-4 text-left text-[9px] uppercase tracking-[0.15em] text-[#e0c0af]/45`}
                                    >
                                        Participante
                                    </th>

                                    <th
                                        className={`${mono.className} px-5 py-4 text-left text-[9px] uppercase tracking-[0.15em] text-[#e0c0af]/45`}
                                    >
                                        CPF
                                    </th>

                                    <th
                                        className={`${mono.className} px-5 py-4 text-left text-[9px] uppercase tracking-[0.15em] text-[#e0c0af]/45`}
                                    >
                                        Cidade
                                    </th>

                                    <th
                                        className={`${mono.className} px-5 py-4 text-left text-[9px] uppercase tracking-[0.15em] text-[#e0c0af]/45`}
                                    >
                                        Telefone
                                    </th>

                                    <th
                                        className={`${mono.className} px-5 py-4 text-left text-[9px] uppercase tracking-[0.15em] text-[#e0c0af]/45`}
                                    >
                                        Pagamento
                                    </th>

                                    <th
                                        className={`${mono.className} px-5 py-4 text-left text-[9px] uppercase tracking-[0.15em] text-[#e0c0af]/45`}
                                    >
                                        Inscrição
                                    </th>

                                    <th className="px-5 py-4" />
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-12 text-center"
                                        >
                                            <span
                                                className={`${mono.className} text-[10px] uppercase tracking-wider text-[#e0c0af]/40`}
                                            >
                                                Carregando inscrições...
                                            </span>
                                        </td>
                                    </tr>
                                ) : filteredRegistrations.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-12 text-center"
                                        >
                                            <span
                                                className={`${mono.className} text-[10px] uppercase tracking-wider text-[#e0c0af]/40`}
                                            >
                                                Nenhuma inscrição encontrada.
                                            </span>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRegistrations.map(
                                        (registration) => (
                                            <tr
                                                key={registration.id}
                                                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                                            >
                                                <td className="px-5 py-4">
                                                    <p className="font-medium">
                                                        {registration.name}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-[#e0c0af]/45">
                                                        {registration.email}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`${mono.className} text-xs text-[#e0c0af]/75`}
                                                    >
                                                        {maskCPF(registration.cpf)}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className="text-sm text-[#e0c0af]/75">
                                                        {registration.city || "-"}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`${mono.className} text-xs text-[#e0c0af]/75`}
                                                    >
                                                        {maskPhone(
                                                            registration.phone
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <PaymentBadge
                                                        payment={registration.payment}
                                                    />
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span
                                                        className={`${mono.className} text-[10px] text-[#e0c0af]/55`}
                                                    >
                                                        {formatDate(
                                                            registration.createdAt
                                                        )}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedRegistration(
                                                                registration
                                                            )
                                                        }
                                                        className={`
                              rounded-lg border border-white/7
                              px-3 py-2
                              ${mono.className}
                              text-[9px] uppercase tracking-wider
                              text-[#e0c0af]/65
                              transition
                              hover:border-[#ff7a00]/30
                              hover:text-[#ff7a00]
                            `}
                                                    >
                                                        DETALHES
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* =================================================
            MOBILE CARDS
        ================================================= */}

                <section className="space-y-3 md:hidden">
                    {loading ? (
                        <div className="rounded-xl border border-white/6 bg-[#1b1b1f] p-10 text-center">
                            <span
                                className={`${mono.className} text-[10px] uppercase tracking-wider text-[#e0c0af]/40`}
                            >
                                Carregando inscrições...
                            </span>
                        </div>
                    ) : filteredRegistrations.length === 0 ? (
                        <div className="rounded-xl border border-white/6 bg-[#1b1b1f] p-10 text-center">
                            <span
                                className={`${mono.className} text-[10px] uppercase tracking-wider text-[#e0c0af]/40`}
                            >
                                Nenhuma inscrição encontrada.
                            </span>
                        </div>
                    ) : (
                        filteredRegistrations.map((registration) => (
                            <button
                                key={registration.id}
                                type="button"
                                onClick={() =>
                                    setSelectedRegistration(
                                        registration
                                    )
                                }
                                className="w-full rounded-xl border border-white/6 bg-[#1b1b1f] p-4 text-left transition hover:border-[#ff7a00]/30"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {registration.name}
                                        </p>

                                        <p className="mt-1 truncate text-xs text-[#e0c0af]/45">
                                            {registration.email}
                                        </p>
                                    </div>

                                    <PaymentBadge
                                        payment={registration.payment}
                                    />
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
                                    <div>
                                        <p
                                            className={`${mono.className} text-[8px] uppercase tracking-wider text-[#e0c0af]/40`}
                                        >
                                            CPF
                                        </p>

                                        <p
                                            className={`${mono.className} mt-1 text-[10px] text-[#e0c0af]/70`}
                                        >
                                            {maskCPF(registration.cpf)}
                                        </p>
                                    </div>

                                    <div>
                                        <p
                                            className={`${mono.className} text-[8px] uppercase tracking-wider text-[#e0c0af]/40`}
                                        >
                                            Cidade
                                        </p>

                                        <p className="mt-1 truncate text-xs text-[#e0c0af]/70">
                                            {registration.city || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <span
                                        className={`${mono.className} text-[9px] text-[#e0c0af]/40`}
                                    >
                                        {formatDate(
                                            registration.createdAt
                                        )}
                                    </span>

                                    <span
                                        className={`${mono.className} text-[9px] uppercase tracking-wider text-[#ff7a00]`}
                                    >
                                        Ver detalhes →
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </section>
            </div>

            {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

            {selectedRegistration && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedRegistration(null);
                        }
                    }}
                >
                    <div className="max-h-[92vh] w-full overflow-hidden rounded-t-2xl border border-white/8 bg-[#1b1b1f] shadow-2xl sm:max-w-3xl sm:rounded-2xl">
                        {/* Modal header */}

                        <div className="flex items-start justify-between border-b border-white/6 p-5">
                            <div className="min-w-0">
                                <p
                                    className={`${mono.className} mb-1 text-[9px] uppercase tracking-[0.2em] text-[#ff7a00]`}
                                >
                                    INSCRIÇÃO
                                </p>

                                <h2
                                    className={`${barlow.className} truncate text-3xl font-semibold uppercase`}
                                >
                                    {selectedRegistration.name}
                                </h2>

                                <p className="mt-1 text-xs text-[#e0c0af]/45">
                                    Registrado em{" "}
                                    {formatDateTime(
                                        selectedRegistration.createdAt
                                    )}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedRegistration(null)
                                }
                                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/7 text-lg text-[#e0c0af]/60 transition hover:border-[#ff7a00]/30 hover:text-[#ff7a00]"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal content */}

                        <div className="max-h-[calc(92vh-100px)] overflow-y-auto p-5">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Dados pessoais */}

                                <div>
                                    <div
                                        className={`${mono.className} mb-2 text-[9px] uppercase tracking-[0.18em] text-[#ff7a00]`}
                                    >
                                        Dados pessoais
                                    </div>

                                    <div className="rounded-xl border border-white/6 bg-[#131317] px-4">
                                        <DetailRow
                                            label="Nome completo"
                                            value={
                                                selectedRegistration.name
                                            }
                                        />

                                        <DetailRow
                                            label="CPF"
                                            value={maskCPF(
                                                selectedRegistration.cpf
                                            )}
                                        />

                                        <DetailRow
                                            label="RG"
                                            value={maskRG(
                                                selectedRegistration.rg
                                            )}
                                        />

                                        <DetailRow
                                            label="Data de nascimento"
                                            value={maskBirthDate(
                                                selectedRegistration.birthDate
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Contato */}

                                <div>
                                    <div
                                        className={`${mono.className} mb-2 text-[9px] uppercase tracking-[0.18em] text-[#ff7a00]`}
                                    >
                                        Contato
                                    </div>

                                    <div className="rounded-xl border border-white/6 bg-[#131317] px-4">
                                        <DetailRow
                                            label="E-mail"
                                            value={
                                                selectedRegistration.email
                                            }
                                        />

                                        <DetailRow
                                            label="Telefone"
                                            value={maskPhone(
                                                selectedRegistration.phone
                                            )}
                                        />

                                        <DetailRow
                                            label="Contato de emergência"
                                            value={
                                                selectedRegistration.emergency
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Endereço */}

                                <div>
                                    <div
                                        className={`${mono.className} mb-2 text-[9px] uppercase tracking-[0.18em] text-[#ff7a00]`}
                                    >
                                        Endereço
                                    </div>

                                    <div className="rounded-xl border border-white/6 bg-[#131317] px-4">
                                        <DetailRow
                                            label="CEP"
                                            value={maskCEP(
                                                selectedRegistration.cep
                                            )}
                                        />

                                        <DetailRow
                                            label="Rua"
                                            value={
                                                selectedRegistration.street
                                            }
                                        />

                                        <DetailRow
                                            label="Número"
                                            value={
                                                selectedRegistration.number
                                            }
                                        />

                                        <DetailRow
                                            label="Bairro"
                                            value={
                                                selectedRegistration.neighborhood
                                            }
                                        />

                                        <DetailRow
                                            label="Cidade"
                                            value={
                                                selectedRegistration.city
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Pagamento */}

                                <div>
                                    <div
                                        className={`${mono.className} mb-2 text-[9px] uppercase tracking-[0.18em] text-[#ff7a00]`}
                                    >
                                        Pagamento
                                    </div>

                                    <div className="rounded-xl border border-white/6 bg-[#131317] px-4">
                                        <div className="flex items-center justify-between py-4">
                                            <span
                                                className={`${mono.className} text-[9px] uppercase tracking-wider text-[#e0c0af]/45`}
                                            >
                                                Forma de pagamento
                                            </span>

                                            <PaymentBadge
                                                payment={
                                                    selectedRegistration.payment
                                                }
                                            />
                                        </div>

                                        <DetailRow
                                            label="ID da inscrição"
                                            value={
                                                selectedRegistration.id
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Saúde */}

                                <div className="lg:col-span-2">
                                    <div
                                        className={`${mono.className} mb-2 text-[9px] uppercase tracking-[0.18em] text-[#ff7a00]`}
                                    >
                                        Saúde
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="rounded-xl border border-white/6 bg-[#131317] p-4">
                                            <p
                                                className={`${mono.className} text-[9px] uppercase tracking-wider text-[#e0c0af]/45`}
                                            >
                                                Medicamento
                                            </p>

                                            <p className="mt-2 text-sm">
                                                {selectedRegistration.useMedication
                                                    ? "Sim"
                                                    : "Não"}
                                            </p>

                                            {selectedRegistration
                                                .useMedication &&
                                                selectedRegistration.useMedicationDescription && (
                                                    <p className="mt-2 text-xs leading-relaxed text-[#e0c0af]/60">
                                                        {
                                                            selectedRegistration.useMedicationDescription
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        <div className="rounded-xl border border-white/6 bg-[#131317] p-4">
                                            <p
                                                className={`${mono.className} text-[9px] uppercase tracking-wider text-[#e0c0af]/45`}
                                            >
                                                Problema de saúde
                                            </p>

                                            <p className="mt-2 text-sm">
                                                {selectedRegistration.healthProblem
                                                    ? "Sim"
                                                    : "Não"}
                                            </p>

                                            {selectedRegistration
                                                .healthProblem &&
                                                selectedRegistration.healthProblemDescription && (
                                                    <p className="mt-2 text-xs leading-relaxed text-[#e0c0af]/60">
                                                        {
                                                            selectedRegistration.healthProblemDescription
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        <div className="rounded-xl border border-white/6 bg-[#131317] p-4">
                                            <p
                                                className={`${mono.className} text-[9px] uppercase tracking-wider text-[#e0c0af]/45`}
                                            >
                                                Restrição alimentar
                                            </p>

                                            <p className="mt-2 text-sm">
                                                {selectedRegistration.foodRestriction
                                                    ? "Sim"
                                                    : "Não"}
                                            </p>

                                            {selectedRegistration
                                                .foodRestriction &&
                                                selectedRegistration.foodRestrictionDescription && (
                                                    <p className="mt-2 text-xs leading-relaxed text-[#e0c0af]/60">
                                                        {
                                                            selectedRegistration.foodRestrictionDescription
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}