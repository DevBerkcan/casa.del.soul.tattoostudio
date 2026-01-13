"use client";

import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { Card, CardBody } from "@nextui-org/card";
import type { Artist } from "@/lib/api/booking";

interface ArtistSelectorProps {
  artists: Artist[];
  selectedArtist: Artist | null;
  onSelect: (artist: Artist) => void;
}

export function ArtistSelector({
  artists,
  selectedArtist,
  onSelect,
}: ArtistSelectorProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-tattoo-black mb-2">
        Wähle deinen Artist
      </h2>
      <p className="text-tattoo-greyScale-500 mb-6">
        Unsere talentierten Tattoo-Artists freuen sich auf dich
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              isPressable
              onPress={() => onSelect(artist)}
              className={`
                transition-all duration-300 cursor-pointer
                ${
                  selectedArtist?.id === artist.id
                    ? "ring-2 ring-tattoo-primary shadow-lg scale-[1.02]"
                    : "hover:shadow-md hover:scale-[1.01]"
                }
              `}
            >
              <CardBody className="p-5">
                <div className="flex items-start gap-4">
                  {/* Artist Photo */}
                  {artist.profileImageUrl && (
                    <div className="w-20 h-20 rounded-full bg-tattoo-light flex-shrink-0 overflow-hidden">
                      <img
                        src={artist.profileImageUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Artist Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-tattoo-black">
                        {artist.name}
                      </h3>
                      {artist.isChef && (
                        <span className="px-2 py-0.5 bg-tattoo-primary/10 text-tattoo-primary text-xs font-semibold rounded">
                          Chef
                        </span>
                      )}
                    </div>

                    <a
                      href={`https://www.instagram.com/${artist.instagramHandle.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-tattoo-greyScale-500 hover:text-tattoo-primary text-sm mb-2 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Instagram size={14} />
                      <span>{artist.instagramHandle}</span>
                    </a>

                    {artist.bio && (
                      <p className="text-sm text-tattoo-greyScale-600 mb-2">
                        {artist.bio}
                      </p>
                    )}

                    {artist.specialties && (
                      <div className="flex flex-wrap gap-1">
                        {artist.specialties.split(",").map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-tattoo-light text-tattoo-greyScale-700 text-xs rounded"
                          >
                            {specialty.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  {selectedArtist?.id === artist.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-tattoo-primary flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </motion.div>
                  )}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
