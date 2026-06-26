"use client";

import React from "react";
import { certifications, type Certification } from "@/data/education";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { 
  ExternalLink, 
  Landmark, 
  Sparkles, 
  Wrench, 
  Cloud, 
  Cpu, 
  Terminal, 
  Lightbulb,
  Check
} from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamically import PDF components with SSR disabled to avoid DOMMatrix issues in Node.js
const PDFDocument = dynamic(() => import("react-pdf").then((mod) => mod.Document), { ssr: false });
const PDFPage = dynamic(() => import("react-pdf").then((mod) => mod.Page), { ssr: false });

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const IconMap = {
  Landmark,
  Sparkles,
  Wrench,
  Cloud,
  Cpu,
  Terminal,
  Lightbulb,
};

function CertIcon({ name, className }: { name?: string; className?: string }) {
  if (!name || !(name in IconMap)) return null;
  const Icon = IconMap[name as keyof typeof IconMap];
  return <Icon className={className} />;
}

function CertificatePreview({ file, title }: { file: string; title: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-10, 10]);

  const pdfHeight = Math.min(window.innerHeight * 0.64, 720);
  const pdfWidth = pdfHeight * 1.414;

  React.useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) setContainerWidth(width);
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener("resize", updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  React.useEffect(() => {
    import("react-pdf").then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  React.useEffect(() => {
    setIsLoaded(false);
  }, [file]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full group cursor-default overflow-visible flex justify-center"
      style={{ perspective: "1200px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0.5); y.set(0.5); }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full max-w-fit relative flex items-center justify-center transition-shadow duration-500 overflow-visible"
      >
        <div className="absolute inset-0 bg-background/40 backdrop-blur-xl rounded-3xl border border-border shadow-xl transition-shadow duration-500" />
        
        <motion.div 
          className="absolute inset-0 rounded-3xl pointer-events-none z-20 overflow-hidden opacity-30 transition-opacity duration-500"
          style={{
            background: useTransform(
              [mouseXSpring, mouseYSpring],
              ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, white 0%, transparent 50%)`
            ),
          }}
        />

        <div className="relative p-3 z-10 overflow-visible" style={{ height: pdfHeight + 24, width: pdfWidth + 24 }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={file}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center p-3"
              style={{ transformStyle: "preserve-3d", transform: "translateZ(40px)" }}
            >
              {containerWidth > 0 && (
                <PDFDocument 
                  file={file} 
                  onLoadSuccess={() => setIsLoaded(true)}
                  loading={<div style={{ height: pdfHeight, width: pdfWidth }} className="bg-foreground/5 animate-pulse rounded-xl" />}
                >
                  <PDFPage 
                    pageNumber={1} 
                    renderTextLayer={false} 
                    renderAnnotationLayer={false}
                    height={pdfHeight}
                    className="rounded-xl overflow-hidden shadow-2xl"
                  />
                </PDFDocument>
              )}
            </motion.div>
          </AnimatePresence>
          <div style={{ height: pdfHeight, width: pdfWidth }} className="invisible pointer-events-none" />
        </div>
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-6 h-6 border-2 border-foreground/5 border-t-foreground/20 rounded-full animate-spin" />
          </div>
        )}
      </motion.div>
    </div>
  );
}

function HolographicBadge({ image, title }: { image: string; title: string }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [0, 1], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-15, 15]);

  function handleMouseMove(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <div 
      className="relative w-full aspect-square group cursor-default overflow-visible flex justify-center"
      style={{ perspective: "1200px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full relative flex items-center justify-center transition-shadow duration-500"
      >
        <div className="absolute inset-0 bg-background opacity-60 backdrop-blur-xl rounded-[2.5rem] border border-border shadow-xl transition-all duration-500" />
        
        <motion.div 
          className="absolute inset-0 rounded-[2.5rem] pointer-events-none z-20 overflow-hidden opacity-30 transition-opacity duration-500"
          style={{
            background: useTransform(
              [mouseXSpring, mouseYSpring],
              ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, white 0%, transparent 50%)`
            ),
          }}
        />

        <motion.img 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          src={image} 
          alt={title}
          className="w-[98%] h-[98%] object-contain drop-shadow-2xl relative z-10 p-2"
          style={{ transform: "translateZ(80px)" }}
        />
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
}

function ModuleSidebar({ 
  cert, 
  selectedSub, 
  onSelect 
}: { 
  cert: Certification; 
  selectedSub: Certification | null; 
  onSelect: (sub: Certification | null) => void;
}) {
  return (
    <div className="flex flex-col h-full bg-secondary/30 border-r border-border p-4 overflow-y-auto">
      <nav className="flex flex-col gap-1">
        {cert.pdfUrl && (
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "flex items-center gap-3 w-full text-left p-2.5 rounded-lg text-[13px] transition-all duration-200",
              selectedSub === null
                ? "bg-background shadow-sm ring-1 ring-border font-medium text-foreground"
                : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              selectedSub === null ? "bg-primary" : "bg-muted-foreground/30"
            )} />
            {cert.groupLabel || "Overview"}
          </button>
        )}

        <div className="mt-4 mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          {cert.itemLabel || "Modules"}
        </div>
        
        {cert.subCertificates?.map((sub) => {
          const isSelected = selectedSub?.title === sub.title;

          return (
            <button
              key={sub.title}
              onClick={() => onSelect(sub)}
              className={cn(
                "flex items-center gap-3 w-full text-left p-2.5 rounded-lg text-[13px] transition-all duration-200 group",
                isSelected
                  ? "bg-background shadow-sm ring-1 ring-border font-medium text-foreground"
                  : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                isSelected ? "bg-primary" : "bg-muted-foreground/30"
              )} />
              <span className="truncate">{sub.title}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function Row({ cert }: { cert: Certification }) {
  const [selectedSub, setSelectedSub] = React.useState<Certification | null>(() => {
    if (!cert.pdfUrl && cert.subCertificates && cert.subCertificates.length > 0) {
      return cert.subCertificates[0];
    }
    return null;
  });

  const currentCert = selectedSub || cert;

  return (
    <Modal>
      <ModalTrigger className="grid w-full grid-cols-[1fr_max-content] gap-4 text-left text-[15px] py-4 hover:bg-secondary/40 transition-colors px-2 rounded-lg">
        <span className="truncate font-medium">{cert.title}</span>
        <span className="text-muted-foreground">{cert.year}</span>
      </ModalTrigger>
      <ModalContent className={cn(
        "max-w-7xl bg-background backdrop-blur-xl border border-border p-0 overflow-hidden text-foreground",
        !cert.subCertificates && "max-w-4xl"
      )}>
        <div className={cn("grid h-full", cert.subCertificates ? "grid-cols-1 md:grid-cols-[280px_1fr]" : "grid-cols-1")}>
          {cert.subCertificates && (
            <ModuleSidebar 
              cert={cert} 
              selectedSub={selectedSub} 
              onSelect={setSelectedSub} 
            />
          )}

          <div className="flex-grow flex flex-col h-[90vh]">
            <div className="p-5 pb-4 border-b border-border bg-card">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-secondary rounded-xl border border-border/50 text-secondary-foreground">
                  <CertIcon name={cert.icon} className="h-5 w-5" />
                </div>
                <div className="flex-grow">
                  <ModalTitle className="text-lg font-bold tracking-tight">{currentCert.title}</ModalTitle>
                  <ModalDescription className="text-[13px] font-medium text-muted-foreground mt-0.5">
                    {currentCert.issuer} · {currentCert.year}
                  </ModalDescription>
                </div>
              </div>
            </div>

            <div className="flex-grow px-8 pb-8 pt-6 flex flex-col items-center justify-start bg-secondary/10">
              {currentCert.pdfUrl ? (
                <div className="w-full flex flex-col items-center space-y-6">
                  <div className="w-full relative flex justify-center">
                    <CertificatePreview file={currentCert.pdfUrl} title={currentCert.title} />
                  </div>
                  
                  <div className="flex items-center justify-center gap-4 w-full relative z-50">
                    <a 
                      href={currentCert.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group inline-flex items-center gap-2 px-6 py-2.5 bg-background border border-border rounded-full text-sm font-semibold hover:bg-secondary transition-colors"
                    >
                      View PDF
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    {currentCert.credentialUrl && (
                      <a 
                        href={currentCert.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Verify
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ) : currentCert.badgeUrl ? (
                <div className="w-full flex-grow flex flex-col items-center justify-start pt-0 space-y-0">
                  <div className="w-full max-w-[600px] aspect-square relative">
                    <HolographicBadge image={currentCert.badgeUrl} title={currentCert.title} />
                  </div>
                  <div className="w-full flex justify-center relative z-50 mt-8">
                    {currentCert.credentialUrl && (
                      <a 
                        href={currentCert.credentialUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Verify Credential
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center py-20 px-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center border border-dashed border-border text-muted-foreground">
                    <CertIcon name={cert.icon} className="h-10 w-10 opacity-30" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Credential document not available for preview.</p>
                  </div>
                  {currentCert.credentialUrl && (
                    <a 
                      href={currentCert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm mt-4"
                    >
                      View Credential
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export function CertificationsList() {
  return (
    <div className="space-y-2">
      <div className="divide-y divide-border">
        {certifications.map((c) => (
          <Row key={c.title} cert={c} />
        ))}
      </div>
    </div>
  );
}
