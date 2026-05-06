"use client";

import { certifications, type Certification } from "@/data/education";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { ExternalLink } from "lucide-react";

function slug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".pdf";
}

function Row({ cert }: { cert: Certification }) {
  return (
    <Modal>
      <ModalTrigger className="grid w-full grid-cols-[max-content_1fr_max-content] gap-4 text-left text-[13px] py-1 hover:bg-[color:var(--ink)]/5 transition-colors">
        <span className="opacity-60">-rw-r--r--</span>
        <span className="truncate">{slug(cert.title)}</span>
        <span className="opacity-60">{cert.year}</span>
      </ModalTrigger>
      <ModalContent className="max-w-2xl">
        <div className="flex items-center gap-3 pr-8">
          {cert.icon ? <span className="text-2xl">{cert.icon}</span> : null}
          <div>
            <ModalTitle>{cert.title}</ModalTitle>
            <ModalDescription>{cert.issuer} · {cert.year}</ModalDescription>
          </div>
        </div>
        {cert.pdfUrl ? (
          <div className="mt-4">
            <iframe src={cert.pdfUrl} className="w-full h-[60vh] border border-[color:var(--ink)]" title={cert.title} />
            <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 hover:underline underline-offset-4 text-[13px]">
              <ExternalLink className="h-3.5 w-3.5" />
              Open PDF in New Tab
            </a>
          </div>
        ) : (
          <p className="mt-4 text-[13px] opacity-70">Certificate document not available for preview.</p>
        )}
      </ModalContent>
    </Modal>
  );
}

export function CertificationsList() {
  return (
    <div className="space-y-2">
      <p className="opacity-60 text-[12px]">$ ls cert/</p>
      <div className="divide-y divide-[color:var(--ink)]/15">
        {certifications.map((c) => (
          <Row key={c.title} cert={c} />
        ))}
      </div>
    </div>
  );
}
