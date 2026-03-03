"use client";

import { useState, useEffect, useRef } from "react";
import type { SiteContent } from "@/lib/content";

type Section = "hero" | "about" | "farm" | "history" | "contact";

const SECTION_LABELS: Record<Section, string> = {
  hero: "Hero Banner",
  about: "Over Ons",
  farm: "Onze Boerderij",
  history: "Geschiedenis",
  contact: "Contact",
};

const IMAGE_FIELDS: Record<string, string> = {
  "hero.image": "Hero achtergrond",
  "about.image": "Over Ons foto",
  "farm.image1": "Boerderij foto 1",
  "farm.image2": "Boerderij foto 2",
  "history.image": "Geschiedenis foto",
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState("");

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((d) => {
        setAuthenticated(d.authenticated);
        if (d.authenticated) loadContent();
      })
      .finally(() => setLoading(false));
  }, []);

  const loadContent = async () => {
    const res = await fetch("/api/content");
    const data = await res.json();
    setContent(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      loadContent();
    } else {
      setLoginError("Ongeldig wachtwoord");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
    setContent(null);
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateField = (path: string, value: string) => {
    if (!content) return;
    const keys = path.split(".");
    const updated = JSON.parse(JSON.stringify(content));
    let obj: Record<string, unknown> = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]] as Record<string, unknown>;
    }
    obj[keys[keys.length - 1]] = value;
    setContent(updated);
  };

  const handleUpload = async (file: File, targetField: string) => {
    setUploading(targetField);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      updateField(targetField, url);
    }
    setUploading(null);
  };

  const triggerUpload = (field: string) => {
    setUploadTarget(field);
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTarget) {
      handleUpload(file, uploadTarget);
    }
    e.target.value = "";
  };

  const getField = (path: string): string => {
    if (!content) return "";
    const keys = path.split(".");
    let obj: unknown = content;
    for (const key of keys) {
      obj = (obj as Record<string, unknown>)[key];
    }
    return (obj as string) || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
        <div className="text-[#9B7B5B] text-lg">Laden...</div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-20 mb-3"
            />
            <h1
              className="text-2xl text-[#1E3529]"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
            >
              Admin
            </h1>
          </div>
          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium text-[#5A5A5A] mb-2">
              Wachtwoord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#EDE5D8] rounded-lg bg-[#FDFBF7] text-[#1C1C1C] focus:outline-none focus:border-[#2B4A3A] focus:ring-1 focus:ring-[#2B4A3A] transition"
              placeholder="Voer wachtwoord in..."
              autoFocus
            />
            {loginError && (
              <p className="text-red-500 text-sm mt-2">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full mt-4 px-6 py-3 bg-[#2B4A3A] text-white rounded-lg font-medium hover:bg-[#1E3529] transition cursor-pointer"
            >
              Inloggen
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] flex items-center justify-center">
        <div className="text-[#9B7B5B]">Content laden...</div>
      </div>
    );
  }

  const renderFields = (section: Section) => {
    const fields: { key: string; label: string; multiline?: boolean }[] = [];
    switch (section) {
      case "hero":
        fields.push(
          { key: "hero.label", label: "Label" },
          { key: "hero.title", label: "Titel" },
          { key: "hero.titleEmphasis", label: "Titel cursief" },
          { key: "hero.subtitle", label: "Ondertitel", multiline: true }
        );
        break;
      case "about":
        fields.push(
          { key: "about.title", label: "Titel" },
          { key: "about.titleEmphasis", label: "Titel cursief" },
          { key: "about.paragraph1", label: "Alinea 1", multiline: true },
          { key: "about.paragraph2", label: "Alinea 2", multiline: true },
          { key: "about.stat1Number", label: "Statistiek 1 nummer" },
          { key: "about.stat1Label", label: "Statistiek 1 label" },
          { key: "about.stat2Number", label: "Statistiek 2 nummer" },
          { key: "about.stat2Label", label: "Statistiek 2 label" },
          { key: "about.stat3Number", label: "Statistiek 3 nummer" },
          { key: "about.stat3Label", label: "Statistiek 3 label" }
        );
        break;
      case "farm":
        fields.push(
          { key: "farm.title", label: "Titel" },
          { key: "farm.titleEmphasis", label: "Titel cursief" },
          { key: "farm.description", label: "Beschrijving", multiline: true },
          { key: "farm.image1Caption", label: "Foto 1 bijschrift" },
          { key: "farm.image2Caption", label: "Foto 2 bijschrift" },
          { key: "farm.feature1Title", label: "Feature 1 titel" },
          { key: "farm.feature1Text", label: "Feature 1 tekst", multiline: true },
          { key: "farm.feature2Title", label: "Feature 2 titel" },
          { key: "farm.feature2Text", label: "Feature 2 tekst", multiline: true },
          { key: "farm.feature3Title", label: "Feature 3 titel" },
          { key: "farm.feature3Text", label: "Feature 3 tekst", multiline: true }
        );
        break;
      case "history":
        fields.push(
          { key: "history.title", label: "Titel" },
          { key: "history.titleEmphasis", label: "Titel cursief" },
          { key: "history.paragraph1", label: "Alinea 1", multiline: true },
          { key: "history.quote", label: "Citaat", multiline: true },
          { key: "history.paragraph2", label: "Alinea 2", multiline: true },
          { key: "history.year", label: "Jaartal" }
        );
        break;
      case "contact":
        fields.push(
          { key: "contact.title", label: "Titel" },
          { key: "contact.titleEmphasis", label: "Titel cursief" },
          { key: "contact.description", label: "Beschrijving", multiline: true },
          { key: "contact.location", label: "Locatie" },
          { key: "contact.phone", label: "Telefoon" },
          { key: "contact.email", label: "E-mail" }
        );
        break;
    }

    // Find image fields for this section
    const imageKeys = Object.keys(IMAGE_FIELDS).filter((k) =>
      k.startsWith(section + ".")
    );

    return (
      <div className="space-y-6">
        {/* Image uploads */}
        {imageKeys.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#5A5A5A] uppercase tracking-wider">
              Afbeeldingen
            </h3>
            {imageKeys.map((key) => (
              <div key={key} className="border border-[#EDE5D8] rounded-xl p-3 md:p-4 bg-[#FDFBF7]">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-sm font-medium text-[#5A5A5A] truncate">
                    {IMAGE_FIELDS[key]}
                  </span>
                  <button
                    onClick={() => triggerUpload(key)}
                    disabled={uploading === key}
                    className="px-3 md:px-4 py-1.5 text-sm bg-[#2B4A3A] text-white rounded-lg hover:bg-[#1E3529] transition disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {uploading === key ? "Uploaden..." : "Nieuwe foto"}
                  </button>
                </div>
                <div className="rounded-lg overflow-hidden bg-[#EDE5D8] aspect-video">
                  <img
                    src={getField(key)}
                    alt={IMAGE_FIELDS[key]}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Text fields */}
        <h3 className="text-sm font-semibold text-[#5A5A5A] uppercase tracking-wider">
          Teksten
        </h3>
        {fields.map(({ key, label, multiline }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-[#5A5A5A] mb-1.5">
              {label}
            </label>
            {multiline ? (
              <textarea
                value={getField(key)}
                onChange={(e) => updateField(key, e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-[#EDE5D8] rounded-lg bg-white text-[#1C1C1C] focus:outline-none focus:border-[#2B4A3A] focus:ring-1 focus:ring-[#2B4A3A] transition resize-y text-sm leading-relaxed"
              />
            ) : (
              <input
                type="text"
                value={getField(key)}
                onChange={(e) => updateField(key, e.target.value)}
                className="w-full px-4 py-3 border border-[#EDE5D8] rounded-lg bg-white text-[#1C1C1C] focus:outline-none focus:border-[#2B4A3A] focus:ring-1 focus:ring-[#2B4A3A] transition text-sm"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />

      {/* Top bar */}
      <header className="bg-white border-b border-[#EDE5D8] px-4 md:px-6 py-3 md:py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-9 md:h-10 shrink-0"
            />
            <span
              className="text-base md:text-lg text-[#1E3529] truncate"
              style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
            >
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <a
              href="/"
              target="_blank"
              className="hidden sm:inline-flex px-3 md:px-4 py-2 text-sm text-[#5A5A5A] border border-[#EDE5D8] rounded-lg hover:bg-[#f8f6f3] transition no-underline"
            >
              Bekijk site
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 md:px-6 py-2 text-sm bg-[#2B4A3A] text-white rounded-lg font-medium hover:bg-[#1E3529] transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? "..." : saved ? "Opgeslagen!" : "Opslaan"}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 md:px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition cursor-pointer"
            >
              Uit
            </button>
          </div>
        </div>
      </header>

      {/* Section tabs - horizontal on mobile, sidebar on desktop */}
      <div className="md:hidden bg-white border-b border-[#EDE5D8] px-4 py-2 sticky top-[57px] z-40 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {(Object.keys(SECTION_LABELS) as Section[]).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition cursor-pointer ${
                activeSection === section
                  ? "bg-[#2B4A3A] text-white font-medium"
                  : "text-[#5A5A5A] bg-[#f8f6f3] hover:bg-[#EDE5D8]"
              }`}
            >
              {SECTION_LABELS[section]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - hidden on mobile */}
        <aside className="hidden md:block w-56 lg:w-64 bg-white border-r border-[#EDE5D8] min-h-[calc(100vh-65px)] p-4 sticky top-[65px] shrink-0">
          <nav className="space-y-1">
            {(Object.keys(SECTION_LABELS) as Section[]).map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition cursor-pointer ${
                  activeSection === section
                    ? "bg-[#2B4A3A] text-white font-medium"
                    : "text-[#5A5A5A] hover:bg-[#f8f6f3]"
                }`}
              >
                {SECTION_LABELS[section]}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 max-w-3xl min-w-0">
          <h2
            className="text-xl md:text-2xl text-[#1E3529] mb-6"
            style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
          >
            {SECTION_LABELS[activeSection]}
          </h2>
          {renderFields(activeSection)}
        </main>
      </div>
    </div>
  );
}
