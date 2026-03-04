export interface SiteContent {
  hero: {
    label: string;
    title: string;
    titleEmphasis: string;
    subtitle: string;
    image: string;
  };
  about: {
    title: string;
    titleEmphasis: string;
    paragraph1: string;
    paragraph2: string;
    image: string;
    stat1Number: string;
    stat1Label: string;
    stat2Number: string;
    stat2Label: string;
    stat3Number: string;
    stat3Label: string;
  };
  farm: {
    title: string;
    titleEmphasis: string;
    description: string;
    image1: string;
    image1Caption: string;
    image2: string;
    image2Caption: string;
    feature1Title: string;
    feature1Text: string;
    feature2Title: string;
    feature2Text: string;
    feature3Title: string;
    feature3Text: string;
  };
  history: {
    title: string;
    titleEmphasis: string;
    paragraph1: string;
    quote: string;
    paragraph2: string;
    image: string;
    year: string;
  };
  contact: {
    title: string;
    titleEmphasis: string;
    description: string;
    location: string;
    phone: string;
    email: string;
  };
}

export const defaultContent: SiteContent = {
  hero: {
    label: "Biologische melkveehouderij",
    title: "Waar natuur en landbouw",
    titleEmphasis: "samenkomen",
    subtitle:
      "Al sinds 2007 combineert familie Smallegoor op De Spithold in Almen duurzame melkveehouderij met rijke biodiversiteit langs de Berkel.",
    image: "/hero.jpeg",
  },
  about: {
    title: "Een familie met",
    titleEmphasis: "passie",
    paragraph1:
      "Sinds 2007 runt de familie Smallegoor de biologische melkveehouderij De Spithold in het prachtige Almen. Gelegen langs de kronkelende Berkel, is ons bedrijf een plek waar traditie en innovatie hand in hand gaan.",
    paragraph2:
      "Wij geloven in een eerlijke, duurzame aanpak van landbouw. Onze koeien grazen vrij in de weilanden en worden met zorg en respect behandeld. Het resultaat: heerlijke biologische melk van gelukkige dieren.",
    image:
      "/familie.jpeg",
    stat1Number: "60",
    stat1Label: "Holstein koeien",
    stat2Number: "35",
    stat2Label: "Jongvee & kalveren",
    stat3Number: "2007",
    stat3Label: "Sinds",
  },
  farm: {
    title: "Biologisch boeren met",
    titleEmphasis: "respect",
    description:
      "Op De Spithold draait alles om de balans tussen effici\u00EBnte productie en een hoge biodiversiteit. Ons land langs de Berkel biedt een uniek ecosysteem dat we koesteren en beschermen.",
    image1:
      "/koeien.jpeg",
    image1Caption: "Onze Holstein koeien in de wei",
    image2: "/boerderij.png",
    image2Caption: "Het hart van De Spithold",
    feature1Title: "Biologisch Gecertificeerd",
    feature1Text:
      "Wij werken volledig biologisch, zonder kunstmest of bestrijdingsmiddelen. Onze grond en dieren krijgen de zorg die ze verdienen.",
    feature2Title: "Hoge Biodiversiteit",
    feature2Text:
      "Langs de Berkel cre\u00EBren we ruimte voor flora en fauna. Bloemrijke randen, weidevogels en een gezond bodemleven zijn onze trots.",
    feature3Title: "Duurzaam & Toekomstgericht",
    feature3Text:
      "Met oog voor de toekomst investeren we in duurzame landbouwmethoden die goed zijn voor mens, dier en milieu.",
  },
  history: {
    title: "De naam",
    titleEmphasis: "Spithold",
    paragraph1:
      'De naam "Spithold" verwijst naar een sleutelbewaarder. Eeuwenlang werd op deze plek de sleutel bewaard van de sluis van een nabijgelegen brug over de Berkel.',
    quote:
      "De steden Zutphen en Deventer voerden meerdere oorlogen om deze strategische locatie langs de Berkel.",
    paragraph2:
      "Deze rijke geschiedenis geeft onze boerderij een bijzondere identiteit. Het herinnert ons eraan dat dit land al eeuwenlang een sleutelrol speelt in de regio. Vandaag de dag zetten wij deze traditie voort met dezelfde toewijding en zorg voor het land.",
    image:
      "/familie.jpeg",
    year: "1600",
  },
  contact: {
    title: "Neem",
    titleEmphasis: "contact",
    description:
      "Benieuwd naar onze boerderij of heeft u vragen? Neem gerust contact op. We verwelkomen u graag op De Spithold.",
    location: "Almen, Gelderland",
    phone: "(0575) 43 12 16",
    email: "h.smallegoor@kpnplanet.nl",
  },
};

let cachedContent: SiteContent | null = null;

export async function getContent(): Promise<SiteContent> {
  // In production with Vercel Blob, fetch from blob storage
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "content.json" });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url, { cache: "no-store" });
        const data = await response.json();
        return { ...defaultContent, ...data };
      }
    } catch {
      // Fall through to default
    }
  }

  // Local development: use in-memory cache
  if (cachedContent) return cachedContent;
  return defaultContent;
}

export async function saveContent(content: SiteContent): Promise<void> {
  cachedContent = content;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put, list, del } = await import("@vercel/blob");
      // Delete old content blob
      const { blobs } = await list({ prefix: "content.json" });
      for (const blob of blobs) {
        await del(blob.url);
      }
      // Save new content
      await put("content.json", JSON.stringify(content), {
        access: "public",
        contentType: "application/json",
      });
    } catch (e) {
      console.error("Failed to save to Vercel Blob:", e);
    }
  }
}
