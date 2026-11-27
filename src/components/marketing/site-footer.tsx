import { Link } from "@tanstack/react-router";
import { IMAGES } from "@/lib/images";
import { NAV_ITEMS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-dark-blue text-gray-300">
      <div className="section-container pb-28 pt-10 sm:pb-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 text-center md:grid-cols-3 md:gap-8 md:text-left">
          {/* Logo + about */}
          <div>
            <div className="mb-4">
              <Link to="/" className="inline-block">
                <img
                  src={IMAGES.logoWhite}
                  alt="Nevada License Defense Logo"
                  className="mx-auto h-auto w-full max-w-[190px] md:mx-0 md:max-w-[260px]"
                />
              </Link>
            </div>
            <p className="mx-auto max-w-sm text-sm leading-relaxed md:mx-0 md:max-w-none">
              A dedicated license defense practice protecting professional licenses in Nevada.
              Experienced representation before all Nevada state licensing boards.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              Part of{" "}
              <a
                href={SITE.firmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-white transition-colors duration-300"
              >
                Craig K. Perry &amp; Associates
              </a>
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm md:block md:space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-gold transition-colors duration-300 font-semibold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li><a href="/discipline-process" className="hover:text-gold transition-colors duration-300 font-semibold">Board Discipline Process</a></li>
              <li><a href="/faq" className="hover:text-gold transition-colors duration-300 font-semibold">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p>
                <a
                  href={SITE.phoneHref}
                  className="text-xl font-bold text-gold hover:text-white transition-colors duration-300 md:text-sm md:font-semibold md:text-inherit md:hover:text-gold"
                >
                  {SITE.phoneDisplay}
                </a>
              </p>
              <p>
                <a
                  href={SITE.emailHref}
                  className="hover:text-gold transition-colors duration-300 font-semibold"
                >
                  {SITE.email}
                </a>
              </p>
              <p className="text-gray-400 mt-3">
                2300 W Sahara Ave #800<br />
                Las Vegas, NV 89102
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 md:mt-12 md:pt-8">
          <div className="flex flex-col items-center justify-between gap-3 text-center text-sm md:flex-row md:gap-0">
            <p>&copy; {new Date().getFullYear()} Nevada License Defense. All rights reserved.</p>
            <a
              href={SITE.firmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-300 font-semibold"
            >
              Craig K. Perry &amp; Associates
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
