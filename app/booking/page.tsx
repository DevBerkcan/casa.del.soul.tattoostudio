"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@nextui-org/button";
import { ChevronLeft, Check, Home, Instagram } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardBody } from "@nextui-org/card";

import { ServiceSelector } from "@/components/booking/ServiceSelector";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { ContactForm } from "@/components/booking/ContactForm";

import {
  getArtists,
  getServices,
  getAvailability,
  createBooking,
  type Artist,
  type Service,
  type TimeSlot,
  type CustomerInfo,
} from "@/lib/api/booking";
import { BookingEvents, getTrackingData } from "@/lib/tracking";

export default function BookingPage() {
  const router = useRouter();

  // Step Management (3 steps: Artist+Service -> Date/Time -> Contact)
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Track step changes
  useEffect(() => {
    if (currentStep === 3) {
      BookingEvents.customerDataEntered();
    }
  }, [currentStep]);

  // Handle step navigation with direction
  const goToNextStep = () => {
    setDirection(1);
    setCurrentStep(currentStep + 1);
  };

  const goToPrevStep = () => {
    setDirection(-1);
    setCurrentStep(currentStep - 1);
  };

  // Artists
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  // Services
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Date & Time
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Customer Info
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load artists on mount
  useEffect(() => {
    async function loadArtists() {
      try {
        const data = await getArtists();
        setArtists(data);
      } catch (err) {
        setError("Fehler beim Laden der Artists");
        console.error(err);
      }
    }
    loadArtists();
  }, []);

  // Load services on mount
  useEffect(() => {
    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError("Fehler beim Laden der Services");
        console.error(err);
      }
    }
    loadServices();
  }, []);

  // Load availability when date is selected
  const handleLoadSlots = async (date: string) => {
    if (!selectedArtist || !selectedService) return;

    setLoadingSlots(true);
    setSelectedTime(null);

    try {
      const data = await getAvailability(selectedArtist.id, selectedService.id, date);
      setAvailableSlots(data.availableSlots);
      // Track date selection
      BookingEvents.dateSelected(date);
    } catch (err) {
      setError("Fehler beim Laden der Verfügbarkeit");
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Handle artist selection
  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
    // Reset following selections when artist changes
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
  };

  // Handle service selection
  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    // Track service selection
    BookingEvents.serviceSelected(service.name, service.price);
    // Reset date/time when service changes
    setSelectedDate(null);
    setSelectedTime(null);
    setAvailableSlots([]);
  };

  // Handle time selection (mit Tracking)
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    // Track time selection
    BookingEvents.timeSlotSelected(time);
  };

  // Handle booking submission
  const handleSubmit = async () => {
    if (!selectedArtist || !selectedService || !selectedDate || !selectedTime) {
      setError("Bitte alle Felder ausfüllen");
      return;
    }

    if (!privacyAccepted) {
      setError("Bitte stimmen Sie den Datenschutzbestimmungen zu");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Hole Tracking-Daten (UTM-Parameter, Referrer)
      const trackingData = getTrackingData();

      const booking = await createBooking({
        artistId: selectedArtist.id,
        serviceId: selectedService.id,
        bookingDate: selectedDate,
        startTime: selectedTime,
        customer: customerInfo,
        // Tracking-Daten mitschicken
        ...trackingData,
      });

      // Track erfolgreiche Buchung
      BookingEvents.bookingCompleted(
        booking.bookingNumber,
        selectedService.name,
        selectedService.price,
        trackingData
      );

      // Redirect to confirmation page
      router.push(`/booking/confirmation/${booking.id}`);
    } catch (err: any) {
      setError(err.message || "Fehler beim Buchen. Bitte versuchen Sie es erneut.");
      setSubmitting(false);
    }
  };

  // Can proceed to next step?
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedArtist !== null && selectedService !== null;
      case 2:
        return selectedDate !== null && selectedTime !== null;
      case 3:
        return (
          customerInfo.firstName.trim() !== "" &&
          customerInfo.lastName.trim() !== "" &&
          customerInfo.email.trim() !== "" &&
          customerInfo.phone.trim() !== "" &&
          privacyAccepted
        );
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tattoo-light via-tattoo-secondary to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-tattoo-greyScale-600 hover:text-tattoo-primary transition-colors mb-6"
        >
          <Home size={20} />
          <span>Zurück zur Startseite</span>
        </Link>

        {/* Progress Stepper - 3 steps */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold
                    transition-all duration-300
                    ${currentStep > step
                      ? "bg-tattoo-primary text-white"
                      : currentStep === step
                        ? "bg-tattoo-primary text-white ring-4 ring-tattoo-primary/20"
                        : "bg-tattoo-greyScale-200 text-tattoo-greyScale-500"
                    }
                  `}
                >
                  {currentStep > step ? <Check size={20} /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded transition-all ${
                      currentStep > step ? "bg-tattoo-primary" : "bg-tattoo-greyScale-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Step Labels */}
          <div className="flex justify-center items-center gap-2 mt-2">
            <p className="text-xs text-tattoo-greyScale-600 text-center">
              {currentStep === 1 && "Artist & Service wählen"}
              {currentStep === 2 && "Termin wählen"}
              {currentStep === 3 && "Kontaktdaten"}
            </p>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 ring-1 ring-tattoo-greyScale-100">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Artist & Service Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Artists */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-tattoo-black mb-2">
                    Wähle deinen Artist
                  </h2>
                  <p className="text-tattoo-greyScale-500 mb-6">
                    Unsere talentierten Tattoo-Artists freuen sich auf dich
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {artists.map((artist, index) => (
                      <motion.div
                        key={artist.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          isPressable
                          onPress={() => handleArtistSelect(artist)}
                          className={`
                            transition-all duration-300 cursor-pointer
                            ${
                              selectedArtist?.id === artist.id
                                ? "ring-2 ring-tattoo-primary shadow-lg scale-[1.02]"
                                : "hover:shadow-md hover:scale-[1.01]"
                            }
                          `}
                        >
                          <CardBody className="p-4">
                            {/* Artist Photo */}
                            <div className="w-full aspect-square rounded-xl bg-tattoo-light mb-3 overflow-hidden">
                              {artist.profileImageUrl ? (
                                <img
                                  src={artist.profileImageUrl}
                                  alt={artist.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-tattoo-greyScale-400">
                                  <span className="text-4xl font-bold">
                                    {artist.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Artist Info */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-base font-bold text-tattoo-black truncate">
                                  {artist.name}
                                </h3>
                                {artist.isChef && (
                                  <span className="px-1.5 py-0.5 bg-tattoo-primary/10 text-tattoo-primary text-xs font-semibold rounded">
                                    Chef
                                  </span>
                                )}
                              </div>

                              <a
                                href={`https://www.instagram.com/${artist.instagramHandle.replace("@", "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-tattoo-greyScale-500 hover:text-tattoo-primary text-xs mb-2 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Instagram size={12} />
                                <span className="truncate">{artist.instagramHandle}</span>
                              </a>

                              {artist.specialties && (
                                <p className="text-xs text-tattoo-greyScale-500 line-clamp-2">
                                  {artist.specialties}
                                </p>
                              )}
                            </div>

                            {/* Selection Indicator */}
                            {selectedArtist?.id === artist.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-tattoo-primary flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 text-white" />
                              </motion.div>
                            )}
                          </CardBody>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Services - Only show when artist is selected */}
                <AnimatePresence>
                  {selectedArtist && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-tattoo-greyScale-200 pt-8"
                    >
                      <h2 className="text-3xl font-bold text-tattoo-black mb-2">
                        Wähle deinen Service
                      </h2>
                      <p className="text-tattoo-greyScale-500 mb-6">
                        Was möchtest du bei {selectedArtist.name} machen?
                      </p>
                      <ServiceSelector
                        services={services}
                        selectedService={selectedService}
                        onSelect={handleServiceSelect}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Step 2: Date & Time Selection */}
            {currentStep === 2 && selectedService && (
              <motion.div
                key="step2"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <DateTimePicker
                  service={selectedService}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  availableSlots={availableSlots}
                  onDateSelect={setSelectedDate}
                  onTimeSelect={handleTimeSelect}
                  onLoadSlots={handleLoadSlots}
                  loading={loadingSlots}
                />
              </motion.div>
            )}

            {/* Step 3: Contact Form */}
            {currentStep === 3 && selectedService && selectedDate && selectedTime && (
              <motion.div
                key="step3"
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ContactForm
                  service={selectedService}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  customerInfo={customerInfo}
                  onCustomerInfoChange={setCustomerInfo}
                  privacyAccepted={privacyAccepted}
                  onPrivacyChange={setPrivacyAccepted}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          {currentStep > 1 ? (
            <Button
              variant="flat"
              onPress={goToPrevStep}
              startContent={<ChevronLeft size={20} />}
              className="bg-tattoo-greyScale-100 font-semibold"
            >
              Zurück
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <Button
              onPress={goToNextStep}
              isDisabled={!canProceed()}
              className="bg-gradient-to-r from-tattoo-primary to-tattoo-secondary text-white font-semibold px-8"
            >
              Weiter
            </Button>
          ) : (
            <Button
              onPress={handleSubmit}
              isDisabled={!canProceed() || submitting}
              isLoading={submitting}
              className="bg-gradient-to-r from-tattoo-primary to-tattoo-secondary text-white font-semibold px-8"
            >
              {submitting ? "Wird gebucht..." : "Termin buchen"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
