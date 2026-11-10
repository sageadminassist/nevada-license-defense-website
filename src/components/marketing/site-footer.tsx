import { Link } from "@tanstack/react-router";
import { IMAGES } from "@/lib/images";
import { NAV_ITEMS, SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-dark-blue text-gray-300">
      <div className="section-container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + about */}
          <div>
            <div className="mb-4">
              <Link to="/" className="inline-block">
                <img
                  src={IMAGES.logoWhite}
                  alt="Nevada License Defense Logo"
                  className="h-auto w-full max-w-[260px]"
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed">
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
            <ul className="space-y-2 text-sm">
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
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p>
                <a
                  href={SITE.phoneHref}
                  className="hover:text-gold transition-colors duration-300 font-semibold"
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

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} Nevada License Defense. All rights reserved.</p>
            <a
              href={SITE.firmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 hover:text-gold transition-colors duration-300 font-semibold"
            >
              Craig K. Perry &amp; Associates
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
