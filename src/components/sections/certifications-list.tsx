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
  Lightbulb 
} from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Dynamically import PDF components with SSR disabled to avoid DOMMatrix issues in Node.js
const PDFDocument = dynamic(() => import("react-pdf").then((mod) => mod.Document), { ssr: false });
const PDFPage = dynamic(() => import("react-pdf").then((mod) => mod.Page), { ssr: false });

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// We still need the original pdfjs for the worker config, but we'll import it inside the client component or guard it
let pdfjsVersion = "4.10.38"; // Fallback version if import fails during SSR

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

  const rotateX = useTransform(mouseYSpring, [0, 1], [7, -7]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-7, 7]);

  // Stable width measurement
  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) setContainerWidth(width);
      }
    };

    // Wait for modal animation to settle before first measurement
    const timer = setTimeout(updateWidth, 500);

    // Responsive resize with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateWidth, 200);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [file]); // Re-measure if file changes (e.g. switching courses)

  // Setup worker on the client side only
  React.useEffect(() => {
    import("react-pdf").then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  // Reset loaded state when file changes
  React.useEffect(() => {
    setIsLoaded(false);
  }, [file]);

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
      ref={containerRef}
      className="relative w-full aspect-[1.414/1] group cursor-default overflow-visible bg-[color:var(--ink)]/[0.02] rounded-sm"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full shadow-lg rounded-sm overflow-hidden border border-[color:var(--ink)]/10 bg-white flex items-center justify-center transition-shadow duration-500 group-hover:shadow-2xl"
      >
        {containerWidth > 0 && (
          <PDFDocument 
            key={file}
            file={file} 
            onLoadSuccess={() => setIsLoaded(true)}
            loading={<div className="absolute inset-0 bg-[color:var(--ink)]/5 animate-pulse" />}
            className="max-w-full"
          >
            <PDFPage 
              pageNumber={1} 
              renderTextLayer={false} 
              renderAnnotationLayer={false}
              width={containerWidth}
              className={cn(
                "transition-opacity duration-700",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </PDFDocument>
        )}
        
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--ink)]/[0.01]">
            <div className="w-6 h-6 border-2 border-[color:var(--ink)]/5 border-t-[color:var(--ink)]/20 rounded-full animate-spin" />
          </div>
        )}
        
        {/* Subtle sheen overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      </motion.div>
    </div>
  );
}

function BadgePreview({ image, title }: { image: string; title: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [0, 1], [-10, 10]);

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
      ref={containerRef}
      className="relative w-full aspect-[1.414/1] group cursor-default overflow-visible bg-[color:var(--ink)]/[0.02] rounded-sm"
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full shadow-lg rounded-sm overflow-hidden border border-[color:var(--ink)]/10 bg-white flex items-center justify-center transition-shadow duration-500 group-hover:shadow-2xl p-8"
      >
        <motion.img 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src={image} 
          alt={title}
          className="max-w-full max-h-full object-contain drop-shadow-2xl relative z-10"
          style={{ transform: "translateZ(50px)" }} // Add depth to the badge itself
        />
        
        {/* Subtle sheen overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--ink)]/[0.02] to-transparent pointer-events-none" />
      </motion.div>
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
      <ModalTrigger className="grid w-full grid-cols-[1fr_max-content] gap-4 text-left text-[15px] py-3 hover:bg-[color:var(--ink)]/5 transition-colors">
        <span className="truncate">{cert.title}</span>
        <span className="opacity-60">{cert.year}</span>
      </ModalTrigger>
      <ModalContent className={cn("max-w-2xl", cert.subCertificates && "max-w-4xl")}>
        <div className="flex items-center gap-3 pr-8">
          <div className="p-2 bg-[color:var(--ink)]/5 border border-[color:var(--ink)]/10 rounded-md">
            <CertIcon name={cert.icon} className="h-5 w-5 opacity-80" />
          </div>
          <div>
            <ModalTitle>{cert.title}</ModalTitle>
            <ModalDescription>{cert.issuer} · {cert.year}</ModalDescription>
          </div>
        </div>

        <div className={cn("mt-6", cert.subCertificates && "grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6")}>
          {cert.subCertificates && (
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[40vh] md:max-h-[60vh] border-b md:border-b-0 md:border-r border-[color:var(--ink)]/10 pb-4 md:pb-0 md:pr-4">
              {cert.pdfUrl && (
                <>
                  <p className="text-[10px] uppercase tracking-wider opacity-40 mb-2 font-bold">{cert.groupLabel || "Program Overview"}</p>
                  <button
                    onClick={() => setSelectedSub(null)}
                    className={cn(
                      "text-left p-2 text-[12px] transition-colors rounded mb-2",
                      selectedSub === null
                        ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                        : "hover:bg-[color:var(--ink)]/5"
                    )}
                  >
                    {cert.title.includes("Professional Certificate") ? "Professional Certificate" : "Main Certificate"}
                  </button>
                </>
              )}
              
              <p className="text-[10px] uppercase tracking-wider opacity-40 mb-2 font-bold mt-2">{cert.itemLabel || "Individual Courses"}</p>
              {cert.subCertificates.map((sub) => (
                <button
                  key={sub.title}
                  onClick={() => setSelectedSub(sub)}
                  className={cn(
                    "text-left p-2 text-[12px] transition-colors rounded",
                    selectedSub?.title === sub.title
                      ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                      : "hover:bg-[color:var(--ink)]/5"
                  )}
                >
                  {sub.title}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {cert.subCertificates && (
               <div className="mb-2">
                 <h4 className="text-[14px] font-medium leading-tight">{currentCert.title}</h4>
                 <p className="text-[12px] opacity-60">{currentCert.issuer} · {currentCert.year}</p>
               </div>
            )}
            
            {currentCert.pdfUrl ? (
              <div className="w-full flex flex-col items-center">
                <CertificatePreview file={currentCert.pdfUrl} title={currentCert.title} />
                <div className="mt-6 flex w-full items-center justify-between">
                  <a 
                    href={currentCert.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 hover:underline underline-offset-4 text-[13px]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open PDF in New Tab
                  </a>
                  {currentCert.credentialUrl && (
                    <a 
                      href={currentCert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 hover:underline underline-offset-4 text-[13px] opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Verify Credential
                    </a>
                  )}
                </div>
              </div>
            ) : currentCert.badgeUrl ? (
              <div className="w-full flex flex-col items-center">
                <BadgePreview image={currentCert.badgeUrl} title={currentCert.title} />
                <div className="mt-6 flex w-full items-center justify-end">
                  {currentCert.credentialUrl && (
                    <a 
                      href={currentCert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 hover:underline underline-offset-4 text-[13px] opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Verify Credential
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center border border-dashed border-[color:var(--ink)]/20 rounded-lg p-12 text-center bg-[color:var(--ink)]/[0.02] min-h-[30vh]">
                <p className="text-[13px] opacity-70 mb-4">Certificate document not available for preview.</p>
                {currentCert.credentialUrl && (
                  <a 
                    href={currentCert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--ink)] text-[color:var(--paper)] rounded-full text-[13px] hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Credential
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}

export function CertificationsList() {
  return (
    <div className="space-y-2">
      <div className="divide-y divide-[color:var(--ink)]/15">
        {certifications.map((c) => (
          <Row key={c.title} cert={c} />
        ))}
      </div>
      <p className="font-mono text-[10px] mt-4 select-none" style={{ opacity: 0.3 }}>
        └─ end of log ─┘
      </p>
    </div>
  );
}
