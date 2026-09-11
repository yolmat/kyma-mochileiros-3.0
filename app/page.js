import Link from "next/link";
import Countdown from "../components/countdown";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d0e11] text-gray-200 antialiased selection:bg-[#E65100] selection:text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0d0e11]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <a href="#" className="flex items-center gap-2.5">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHZBu3hF_jNcQ1xXpKENPqbsUV_8Vm_xqsjNMyAhaiIg1f5OoZR2I89zeh1FyH8Q-N16_l4bsZ_HDCVAcekp_7A5yLVefO1x6Gm51Q6kQnjF2kj7b2sOIc4b2jj6o3aWv1Rwksya1DwzPRaDzouAzpnrkHk1pkJrGaECy6Bl26AXDIuGzhbaPGppic4Ygv-TVLP3-Rcl8DMdkqGv23OJYoj-E55zfwatcPkMNg-AwKdDZrPwYgxz3wJM8cKxgiKiMVcQ0"
              alt="Logo Mochileiros 3.0"
              className="h-8 w-8 rounded-full border border-teal-500/40 object-cover shadow-md"
            />

            <div className="flex flex-col">
              <span className="font-display text-lg leading-none tracking-widest text-white">
                MOCHILEIROS
              </span>

            </div>
          </a>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/passport"
              className=" rounded-full border border-gray-600 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-200 transition hover:bg-white/10 sm:px-4 sm:text-xs"
            >
              Pré-venda
            </Link>
          </div>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="relative">

        {/* GLOW CENTRAL */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#A855F7]/10 blur-[140px]" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* HERO */}
          <section className="mx-auto flex min-h-[calc(100svh-68px)] w-full max-w-6xl flex-col items-center justify-center py-8 sm:py-12 lg:py-16">

            {/* TEXTO + MOCHILA */}
            <div className="relative flex w-full flex-col items-center">

              {/* TEXTO DE FUNDO */}
              <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center">

                <span
                  className="font-display stroke-text whitespace-nowrap text-center uppercase leading-none tracking-[0.15em] sm:tracking-[0.18em] lg:tracking-[0.2em]"
                  style={{
                    fontSize: "clamp(3.2rem, 11vw, 9rem)",
                  }}
                >
                  MOCHILEIROS
                </span>

                <div className="mt-[11rem] flex max-w-full items-center justify-center gap-1.5 sm:mt-[14rem] sm:gap-2 lg:mt-[15rem]">

                  <span className="font-script -rotate-2 text-2xl text-[#A855F7] drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] sm:text-3xl lg:text-4xl">
                    3.0
                  </span>

                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#00897B]" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#00897B] sm:block">
                    Um Evento Kyma
                  </span>

                </div>
              </div>

              {/* MOCHILA */}
              <div className="relative z-20 my-2 flex aspect-square w-[65vw] max-w-[280px] items-center justify-center sm:w-[340px] sm:max-w-[340px] lg:w-[420px] lg:max-w-[420px]">

                <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-tr from-[#E65100]/30 via-[#A855F7]/20 to-transparent blur-3xl" />

                <div className="pulse-glow absolute h-[55%] w-[55%] rounded-full bg-[#E65100]/20 blur-2xl" />

                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3UcN5-2isMaEjXW9ijbYQuqUWhojArZ7MboFwI5ZZUf-OEjpX9UaDF8BnVwZGETfW9DkkJD0MQ02l8i2o4wHGAQFchkPRzXDllmZ0IOT-MAF6Sfylf55iyJ9_Rw-ykP-_xFuLB8QijRHU6GN79_ufABBMxGEPOSAKvXBne-IAP1ty0R201vvZS57lo4cXxcDhRkGDaBDzBq-QCtzlokbwuqGxEO3iQc-ejanIy1ri1JCSAFsTTNTj_QQx-b8rHQLfDD4"
                  alt="Mochila Oficial da Expedição Mochileiros 3.0"
                  className="hero-shadow animate-float relative h-full w-full object-contain -scale-x-100"
                />

              </div>

            </div>

            {/* PARTE INFERIOR DO HERO */}
            <div className="relative z-20 mt-2 w-full max-w-xl sm:mt-4 lg:max-w-2xl">

              {/* COUNTDOWN */}
              <div className="w-full px-0 sm:px-4">

                <div className="flex flex-col items-center rounded-2xl border border-white/[0.08] bg-[#121418]/90 p-3 shadow-[0_0_30px_rgba(230,81,0,0.12)] backdrop-blur-xl sm:p-4">

                  <div className="mb-3 flex items-center gap-1.5 sm:mb-4">

                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E65100]" />

                    <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#E65100] sm:text-[9px] sm:tracking-[0.2em]">
                      O mochileiros começa em:
                    </span>

                  </div>

                  <Countdown />

                </div>
              </div>

              {/* CTA */}
              <div className="mt-3 w-full sm:mt-4">

                <Link
                  href="/passport"
                  className="hidden group md:flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#E65100] via-amber-600 to-orange-500 px-5 py-3.5 text-center text-xs font-extrabold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(230,81,0,0.4)] transition-all hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(230,81,0,0.5)] active:scale-[0.98] sm:py-4 sm:text-sm"
                >
                  <span className="flex items-center justify-center gap-2">
                    GARANTIR VAGA

                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                </Link>

                <p className="mt-2 text-center text-[9px] tracking-wide text-gray-500 sm:text-[10px]">
                  Inscrições seguras • Confirmação instantânea
                </p>

              </div>

            </div>

          </section>

        </div>
      </div>

      {/* CTA FIXO MOBILE */}
      <div
        id="inscricao"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 md:hidden"
      >
        <div className="mx-auto max-w-md">
          <Link
            href="/passport"
            className="pointer-events-auto block w-full rounded-xl bg-[#E65100] px-4 py-3 text-center text-xs font-extrabold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(230,81,0,0.45)]"
          >
            Garantir minha vaga
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] px-4 pb-12 pt-6 text-center text-[10px] text-gray-500 sm:text-[11px]">

        <p>
          © 2025 Mochileiros 3.0 • Todos os direitos reservados
        </p>

        <p className="mt-1 text-[9px] text-gray-600 sm:text-[10px]">
          Aventura consciente • Deixe apenas pegadas
        </p>

      </footer>

    </main>
  );
}

function CountdownItem({ value, label, highlight }) {
  const textColor =
    highlight === "orange"
      ? "text-[#E65100]"
      : highlight === "purple"
        ? "text-[#A855F7]"
        : "text-white";

  return (
    <div className="flex min-h-[58px] flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 px-1 py-2 sm:min-h-[68px] sm:rounded-xl">
      <span
        className={`font-display text-xl leading-none tracking-wider sm:text-2xl ${textColor}`}
      >
        {value}
      </span>

      <span className="mt-1 text-[7px] font-semibold uppercase tracking-wider text-gray-400 sm:text-[8px]">
        {label}
      </span>
    </div>
  );
}

function FeaturePlaceholder() {
  return (
    <div className="h-24 rounded-xl border border-white/[0.06] bg-white/[0.02] sm:h-28" />
  );
}