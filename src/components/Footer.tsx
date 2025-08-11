
import React, {useMemo} from 'react';
import { Link } from 'react-router-dom';
import {usePublicContent} from "@/hooks/usePublicContent.ts";
import {InlineImage} from "@/components/ui/InlineImage.tsx";
import {InlineText} from "@/components/ui/InlineText.tsx";

export const Footer: React.FC = () => {
  const { data: content = [], isLoading, isError } = usePublicContent();

  const headerContent = useMemo(
      () => content.filter((item) => item.page === "header"),
      [content]
  );

  const byId = useMemo(
      () => Object.fromEntries(headerContent.map((i) => [i.id, i])),
      [headerContent]
  );

  const get = (id: string) => byId[id]?.value || "";
  const getAlt = (id: string) => byId[id]?.alt || "";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Practice Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <InlineImage
                    id="header-image"
                    defaultSrc={get("header-image")}
                    defaultAlt={getAlt("header-image") || "Doctor illustration"}
                    imgClassName="w-8 h-8 object-contain rounded-full"
                />
              </div>
              <div>
                <InlineText
                    id="header-dr-name"
                    defaultValue={get("header-dr-name")}
                    className="text-xl font-bold"
                    as="h2"
                />
                <InlineText
                    id="header-dr-sub"
                    defaultValue={get("header-dr-sub")}
                    className="text-gray-300"
                    as="p"
                />
              </div>
            </div>
            <InlineText
                id="header-dr-description"
                defaultValue={get("header-dr-description")}
                className="text-gray-400 mb-4"
                as="p"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Me
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-400 hover:text-white">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/publications" className="text-gray-400 hover:text-white">
                  Publications
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <InlineText
                  id="header-address"
                  defaultValue={get("header-address")}
                  className=""
                  as="p"
              />
              <InlineText
                  id="header-address2"
                  defaultValue={get("header-address2")}
                  className=""
                  as="p"
              />
              <InlineText
                  id="header-phone"
                  defaultValue={get("header-phone")}
                  className=""
                  as="p"
              />
              <InlineText
                  id="header-email"
                  defaultValue={get("header-email")}
                  className=""
                  as="p"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} <InlineText
              id="header-dr-name"
              defaultValue={get("header-dr-name")}
              className="text-gray-400 mb-4"
              as="span"
          />. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
