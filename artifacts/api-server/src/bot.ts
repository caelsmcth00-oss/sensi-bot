import {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Interaction,
  EmbedBuilder,
} from "discord.js";
import { logger } from "./lib/logger";

const MODELOS: Record<string, string[]> = {
  Apple: ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15", "iPhone SE", "iPhone XS", "iPhone XR", "iPhone 8", "iPhone 7", "Outro"],
  Samsung: ["Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22", "Galaxy S21 Ultra", "Galaxy S21+", "Galaxy S21", "Galaxy S20 Ultra", "Galaxy S20+", "Galaxy S20", "Galaxy S10+", "Galaxy S10", "Galaxy S10e", "Galaxy S9+", "Galaxy S9", "Galaxy S8+", "Galaxy S8", "Galaxy Note 20 Ultra", "Galaxy Note 20", "Galaxy Note 10+", "Galaxy Note 10", "Galaxy Note 9", "Galaxy Note 8", "Galaxy A74", "Galaxy A73", "Galaxy A72", "Galaxy A71", "Galaxy A70", "Galaxy A56", "Galaxy A55", "Galaxy A54", "Galaxy A53", "Galaxy A52", "Galaxy A51", "Galaxy A50", "Galaxy A36", "Galaxy A35", "Galaxy A34", "Galaxy A33", "Galaxy A32", "Galaxy A31", "Galaxy A30", "Galaxy A26", "Galaxy A25", "Galaxy A24", "Galaxy A23", "Galaxy A22", "Galaxy A21s", "Galaxy A21", "Galaxy A20s", "Galaxy A20", "Galaxy A14", "Galaxy A13", "Galaxy A12", "Galaxy A11", "Galaxy A10s", "Galaxy A10", "Galaxy M62", "Galaxy M54", "Galaxy M53", "Galaxy M52", "Galaxy M51", "Galaxy M42", "Galaxy M40", "Galaxy M36", "Galaxy M35", "Galaxy M34", "Galaxy M33", "Galaxy M32", "Galaxy M31s", "Galaxy M31", "Galaxy M30s", "Galaxy M30", "Galaxy M22", "Galaxy M21s", "Galaxy M21", "Galaxy M20", "Galaxy M13", "Galaxy M12", "Galaxy M11", "Galaxy Z Fold 6", "Galaxy Z Fold 5", "Galaxy Z Fold 4", "Galaxy Z Fold 3", "Galaxy Z Fold 2", "Galaxy Z Fold", "Galaxy Z Flip 6", "Galaxy Z Flip 5", "Galaxy Z Flip 4", "Galaxy Z Flip 3", "Galaxy Z Flip", "Galaxy S24 FE", "Galaxy S23 FE", "Galaxy S21 FE", "Galaxy S20 FE", "Galaxy J8", "Galaxy J7 Prime", "Galaxy J7", "Galaxy J6", "Galaxy J5 Prime", "Galaxy J5", "Galaxy J4", "Galaxy J3", "Outro"],
  Xiaomi: ["Xiaomi 15 Ultra", "Xiaomi 15 Pro", "Xiaomi 15", "Xiaomi 14 Ultra", "Xiaomi 14 Pro", "Xiaomi 14", "Xiaomi 14T Pro", "Xiaomi 14T", "Xiaomi 13 Ultra", "Xiaomi 13 Pro", "Xiaomi 13", "Xiaomi 13T Pro", "Xiaomi 13T", "Xiaomi 12S Ultra", "Xiaomi 12S Pro", "Xiaomi 12S", "Xiaomi 12 Pro", "Xiaomi 12", "Xiaomi 12X", "Xiaomi 11 Ultra", "Xiaomi 11T Pro", "Xiaomi 11T", "Xiaomi 11", "Xiaomi 10T Pro", "Xiaomi 10T", "Xiaomi 10", "Xiaomi 9T Pro", "Xiaomi 9T", "Xiaomi 9", "Xiaomi 8", "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14", "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13", "Redmi Note 12 Pro+", "Redmi Note 12 Pro", "Redmi Note 12", "Redmi Note 11 Pro+", "Redmi Note 11 Pro", "Redmi Note 11", "Redmi Note 10 Pro", "Redmi Note 10", "Redmi Note 9 Pro", "Redmi Note 9", "Redmi Note 8 Pro", "Redmi Note 8", "Redmi Note 7 Pro", "Redmi Note 7", "Redmi K80 Pro", "Redmi K80", "Redmi K70 Pro", "Redmi K70", "Redmi K60 Pro", "Redmi K60", "Redmi K50 Pro", "Redmi K50", "Redmi K40 Pro", "Redmi K40", "Redmi 14C", "Redmi 13C", "Redmi 12C", "Redmi 11C", "Redmi 10C", "Redmi 9C", "Redmi A5", "Redmi A4", "Redmi A3", "Redmi A2", "Redmi A1", "Poco F7 Pro", "Poco F7", "Poco F6 Pro", "Poco F6", "Poco F5 Pro", "Poco F5", "Poco F4 GT", "Poco F4", "Poco F3 GT", "Poco F3", "Poco X7 Pro", "Poco X7", "Poco X6 Pro", "Poco X6", "Poco X5 Pro", "Poco X5", "Poco X4 Pro", "Poco X4", "Poco X3 Pro", "Poco X3", "Poco M7 Pro", "Poco M6 Pro", "Poco M6", "Poco M5s", "Poco M5", "Poco M4 Pro", "Poco M4", "Poco M3 Pro", "Poco M3", "Poco C75", "Poco C65", "Poco C55", "Poco C50", "Black Shark 6 Pro", "Black Shark 6", "Black Shark 5 Pro", "Black Shark 5", "Black Shark 4 Pro", "Outro"],
  Motorola: ["Motorola Edge 40 Pro", "Motorola Edge 40", "Motorola Edge 30 Ultra", "Motorola Edge 30 Pro", "Motorola Edge 30", "Motorola Edge 20 Pro", "Motorola Edge 20", "Motorola Edge 20 Lite", "Motorola Edge+ (2023)", "Motorola Edge+ (2022)", "Motorola One Vision", "Motorola One Fusion+", "Motorola One Fusion", "Motorola One Macro", "Motorola One Power", "Motorola One", "Motorola Moto G200", "Motorola Moto G100", "Motorola Moto G60", "Motorola Moto G60s", "Motorola Moto G40 Fusion", "Motorola Moto G9 Power", "Motorola Moto G9 Plus", "Motorola Moto G9", "Motorola Moto G8 Plus", "Motorola Moto G8", "Motorola Moto G8 Play", "Motorola Moto G7 Plus", "Motorola Moto G7", "Motorola Moto G7 Power", "Motorola Moto G7 Play", "Motorola Moto G6 Plus", "Motorola Moto G6", "Motorola Moto G6 Play", "Motorola Moto G5 Plus", "Motorola Moto G5", "Motorola Moto G4 Plus", "Motorola Moto G4", "Motorola Moto G4 Play", "Motorola Moto X30 Pro", "Motorola Moto X4", "Motorola Moto Z4", "Motorola Moto Z3 Play", "Motorola Moto Z3", "Motorola Moto Z2 Force", "Motorola Moto Z2 Play", "Motorola Moto Z", "Motorola Razr 2023", "Motorola Razr 5G", "Motorola Razr", "Motorola Moto E40", "Motorola Moto E32", "Motorola Moto E30", "Motorola Moto E20", "Motorola Moto E7 Power", "Motorola Moto E7", "Motorola Moto E7 Plus", "Motorola Moto E6 Plus", "Motorola Moto E6", "Motorola Moto E5 Plus", "Motorola Moto E5", "Motorola Moto E4 Plus", "Motorola Moto E4", "Motorola Moto C Plus", "Motorola Moto C", "Outro"],
  Asus: ["Asus ZenFone 10", "Asus ZenFone 9", "Asus ZenFone 8 Flip", "Asus ZenFone 8", "Asus ZenFone 7 Pro", "Asus ZenFone 7", "Asus ZenFone 6", "Asus ZenFone 5Z", "Asus ZenFone 5", "Asus ZenFone 4 Pro", "Asus ZenFone 4", "Asus ROG Phone 7", "Asus ROG Phone 6 Pro", "Asus ROG Phone 6", "Asus ROG Phone 5 Ultimate", "Asus ROG Phone 5 Pro", "Asus ROG Phone 5", "Asus ROG Phone 5s", "Asus ROG Phone 3", "Asus ROG Phone 2", "Asus ROG Phone", "Asus ZenFone Max Pro M2", "Asus ZenFone Max Pro M1", "Asus ZenFone Max M2", "Asus ZenFone Max M1", "Asus ZenFone 3 Deluxe", "Asus ZenFone 3 Max", "Asus ZenFone 3", "Asus ZenFone 2 Deluxe", "Asus ZenFone 2 Laser", "Asus ZenFone 2", "Asus ZenFone 2E", "Outro"],
  Realme: ["Realme GT 2 Pro", "Realme GT 2", "Realme GT 5G", "Realme GT Neo 3", "Realme GT Neo 2", "Realme GT", "Realme GT Master Edition", "Realme 11 Pro", "Realme 11", "Realme 10 Pro+", "Realme 10 Pro", "Realme 10", "Realme 9 Pro+", "Realme 9 Pro", "Realme 9i", "Realme 9", "Realme 8 Pro", "Realme 8 5G", "Realme 8", "Realme 8i", "Realme 7 Pro", "Realme 7", "Realme 7i", "Realme 6 Pro", "Realme 6", "Realme 6i", "Realme 5 Pro", "Realme 5", "Realme 5s", "Realme 3 Pro", "Realme 3", "Realme 3i", "Realme Narzo 50 Pro 5G", "Realme Narzo 50", "Realme Narzo 30 Pro", "Realme Narzo 30", "Realme Narzo 20 Pro", "Realme Narzo 20", "Realme Narzo 10A", "Realme Narzo 10", "Realme C55", "Realme C53", "Realme C51", "Realme C35", "Realme C31", "Realme C25Y", "Realme C25s", "Realme C25", "Realme C21Y", "Realme C21", "Realme X50 Pro 5G", "Realme X50", "Realme X3 SuperZoom", "Realme X3", "Realme X2 Pro", "Realme X2", "Realme X", "Realme XT", "Outro"],
  Huawei: ["Huawei P60 Pro", "Huawei P60", "Huawei P50 Pro", "Huawei P50", "Huawei P40 Pro", "Huawei P40", "Huawei P40 Lite", "Huawei P30 Pro", "Huawei P30", "Huawei P30 Lite", "Huawei P20 Pro", "Huawei P20", "Huawei P20 Lite", "Huawei Mate 50 Pro", "Huawei Mate 50", "Huawei Mate 40 Pro", "Huawei Mate 40", "Huawei Mate 30 Pro", "Huawei Mate 30", "Huawei Mate 20 Pro", "Huawei Mate 20", "Huawei Nova 10 Pro", "Huawei Nova 10", "Huawei Nova 9 Pro", "Huawei Nova 9", "Huawei Nova 8 Pro", "Huawei Nova 8", "Huawei Nova 7 Pro", "Huawei Nova 7", "Huawei Nova 6", "Huawei Nova 5T", "Huawei Nova 5 Pro", "Huawei Nova 5", "Huawei Nova 4", "Huawei Nova 3i", "Huawei Nova 3", "Huawei Honor 90 Pro", "Huawei Honor 90", "Huawei Honor 80 Pro", "Huawei Honor 80", "Huawei Honor 70 Pro", "Huawei Honor 70", "Huawei Honor 60 Pro", "Huawei Honor 60", "Huawei Honor 50 Pro", "Huawei Honor 50", "Huawei Honor 30 Pro", "Huawei Honor 30", "Huawei Honor 20 Pro", "Huawei Honor 20", "Huawei Y9s", "Huawei Y9", "Huawei Y8s", "Huawei Y8", "Huawei Y7 Pro", "Huawei Y7", "Huawei Y6s", "Huawei Y6", "Huawei Y5s", "Huawei Y5", "Huawei Y4", "Outro"],
  LG: ["LG Velvet", "LG V60 ThinQ", "LG V50 ThinQ", "LG V40 ThinQ", "LG V30", "LG V20", "LG G8 ThinQ", "LG G7 ThinQ", "LG G6", "LG G5", "LG G4", "LG G3", "LG G2", "LG Q60", "LG Q52", "LG Q51", "LG Q9", "LG Q8", "LG Q7", "LG Q6", "LG K92 5G", "LG K61", "LG K51", "LG K41", "LG K40", "LG K20", "LG K10", "LG K8", "LG K7", "LG K5", "LG K4", "LG Stylo 6", "LG Stylo 5", "LG Stylo 4", "LG Stylo 3", "LG G8X ThinQ", "LG G8S ThinQ", "LG G7 Fit", "LG G7 One", "LG G4 Stylus", "LG Nexus 5X", "LG G Flex 2", "LG G Flex", "Outro"],
  Sony: ["Xperia 1 IV", "Xperia 1 III", "Xperia 1 II", "Xperia 1", "Xperia 10 IV", "Xperia 10 III", "Xperia 10 II", "Xperia 10", "Xperia 5 IV", "Xperia 5 III", "Xperia 5 II", "Xperia 5", "Xperia 8", "Xperia XZ Premium", "Xperia XZ2 Premium", "Xperia XZ2 Compact", "Xperia XZ2", "Xperia XZ1 Compact", "Xperia XZ1", "Xperia XZ Compact", "Xperia XZ", "Xperia X Performance", "Xperia X", "Xperia Z5 Premium", "Xperia Z5 Compact", "Xperia Z5", "Xperia Z3 Compact", "Xperia Z3+", "Xperia Z3", "Xperia Z2", "Xperia Z1 Compact", "Xperia Z1", "Xperia Z Ultra", "Xperia Z", "Xperia XA2 Plus", "Xperia XA2 Ultra", "Xperia XA2", "Xperia XA1 Plus", "Xperia XA1 Ultra", "Xperia XA1", "Xperia L4", "Xperia L3", "Xperia L2", "Xperia L1", "Xperia M5", "Xperia M4 Aqua", "Xperia M2", "Outro"],
  Infinix: ["Infinix Zero 30", "Infinix Zero 20", "Infinix Zero 10", "Infinix Zero 8i", "Infinix Zero 8", "Infinix Note 12 Pro", "Infinix Note 12", "Infinix Note 11 Pro", "Infinix Note 11", "Infinix Note 10 Pro", "Infinix Note 10", "Infinix Note 9 Pro", "Infinix Note 9", "Infinix Note 8", "Infinix Hot 12 Pro", "Infinix Hot 12", "Infinix Hot 11S", "Infinix Hot 11", "Infinix Hot 10 Play", "Infinix Hot 10T", "Infinix Hot 10", "Infinix Smart 6 Plus", "Infinix Smart 6", "Infinix Smart 5", "Infinix Smart 4", "Infinix Smart 3 Plus", "Infinix Smart 3", "Infinix S5 Pro", "Infinix S5", "Infinix S4", "Infinix S3", "Infinix Hot 9 Pro", "Infinix Hot 9", "Infinix Hot 8", "Infinix Hot 7 Pro", "Infinix Hot 7", "Infinix Hot 6 Pro", "Infinix Hot 6", "Infinix Hot 5 Pro", "Infinix Hot 5", "Infinix Hot 4 Pro", "Infinix Hot 4", "Outro"],
};

const TOUTES_MARQUES = Object.keys(MODELOS);

function trouverModele(input: string): { marque: string; modele: string } | null {
  const recherche = input.toLowerCase().trim();
  for (const marque of TOUTES_MARQUES) {
    for (const modele of MODELOS[marque]!) {
      if (modele.toLowerCase().includes(recherche) || recherche.includes(modele.toLowerCase())) {
        return { marque, modele };
      }
    }
  }
  return null;
}

function pseudo(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * 101) + 100;
}

function pseudoBtn(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return Math.floor((x - Math.floor(x)) * 19) + 45;
}

function genererSensi(modele: string) {
  const graine = modele.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    geral: pseudo(graine + 1),
    pontoVermelho: pseudo(graine + 2),
    mira2x: pseudo(graine + 3),
    mira4x: pseudo(graine + 4),
    tamanhoBotao: pseudoBtn(graine + 5),
  };
}

const commands = [
  new SlashCommandBuilder()
    .setName("sensi")
    .setDescription("Commandes Sensi Gaming")
    .addSubcommand((sub) =>
      sub
        .setName("sensibilidade")
        .setDescription("Sensibilités Free Fire pour votre téléphone")
        .addStringOption((opt) =>
          opt
            .setName("telefone")
            .setDescription("Modèle de téléphone (ex: iPhone 11, Galaxy A54, Redmi Note 12, Moto G9)")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("marcas").setDescription("Voir toutes les marques supportées")
    )
    .addSubcommand((sub) =>
      sub.setName("aide").setDescription("Afficher l'aide")
    )
    .addSubcommand((sub) =>
      sub.setName("info").setDescription("Infos sur le bot")
    )
    .addSubcommand((sub) =>
      sub.setName("ping").setDescription("Vérifier la latence du bot")
    ),
  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Informations Free Fire")
    .addSubcommand((sub) =>
      sub
        .setName("profile")
        .setDescription("Voir le profil Free Fire d'un joueur")
        .addStringOption((opt) =>
          opt
            .setName("id")
            .setDescription("ID Free Fire du joueur")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("region")
            .setDescription("Région du joueur (auto-détection si non précisé)")
            .setRequired(false)
            .addChoices(
              { name: "Brésil (BR)", value: "br" },
              { name: "Inde (IND)", value: "ind" },
              { name: "Asie du Sud-Est (SG)", value: "sg" },
              { name: "Indonésie (ID)", value: "id" },
              { name: "Moyen-Orient (ME)", value: "me" },
              { name: "Pakistan (PK)", value: "pk" },
              { name: "Bangladesh (BD)", value: "bd" },
              { name: "Vietnam (VN)", value: "vn" },
              { name: "Thaïlande (TH)", value: "th" },
              { name: "Taiwan (TW)", value: "tw" },
              { name: "Russie (RU)", value: "ru" },
              { name: "USA (US)", value: "us" },
              { name: "CIS (CIS)", value: "cis" },
            )
        )
    ),
  new SlashCommandBuilder()
    .setName("checkban")
    .setDescription("Vérifier si un compte Free Fire est banni ou clean")
    .addStringOption((opt) =>
      opt
        .setName("id")
        .setDescription("ID Free Fire du joueur")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("region")
        .setDescription("Région du joueur (auto-détection si non précisé)")
        .setRequired(false)
        .addChoices(
          { name: "Brésil (BR)", value: "br" },
          { name: "Inde (IND)", value: "ind" },
          { name: "Asie du Sud-Est (SG)", value: "sg" },
          { name: "Indonésie (ID)", value: "id" },
          { name: "Moyen-Orient (ME)", value: "me" },
          { name: "Pakistan (PK)", value: "pk" },
          { name: "Bangladesh (BD)", value: "bd" },
          { name: "Vietnam (VN)", value: "vn" },
          { name: "Thaïlande (TH)", value: "th" },
          { name: "Taiwan (TW)", value: "tw" },
          { name: "Russie (RU)", value: "ru" },
          { name: "USA (US)", value: "us" },
          { name: "CIS (CIS)", value: "cis" },
        )
    ),
].map((cmd) => cmd.toJSON());

function formatTimestamp(ts: string): string {
  const d = new Date(parseInt(ts) * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function getRegionFlag(region: string): string {
  const flags: Record<string, string> = {
    IND: "🇮🇳 India", BR: "🇧🇷 Brazil", SG: "🇸🇬 Singapore",
    ID: "🇮🇩 Indonesia", ME: "🇸🇦 Middle East", PK: "🇵🇰 Pakistan",
    BD: "🇧🇩 Bangladesh", VN: "🇻🇳 Vietnam", TH: "🇹🇭 Thailand",
    TW: "🇹🇼 Taiwan", RU: "🇷🇺 Russia", US: "🇺🇸 USA",
    CIS: "🌍 CIS",
  };
  return flags[region.toUpperCase()] ?? region;
}

const ALL_REGIONS = ["br", "ind", "sg", "id", "me", "pk", "bd", "vn", "th", "tw", "ru", "us", "cis"];

async function fetchFFProfileRegion(uid: string, region: string): Promise<Record<string, unknown> | null> {
  const devUid = process.env["HL_DEV_UID"];
  const apiKey = process.env["HL_API_KEY"];
  const url = `https://proapis.hlgamingofficial.com/main/games/freefire/account/api?sectionName=AllData&PlayerUid=${uid}&region=${region}&useruid=${devUid}&api=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json() as Record<string, unknown>;
    if (!res.ok || data["error"]) return null;
    const result = data["result"] as Record<string, unknown>;
    if (!result || !(result["AccountInfo"])) return null;
    return result;
  } catch {
    return null;
  }
}

async function fetchFFProfile(uid: string, region: string | null): Promise<{ data: Record<string, unknown>; region: string } | null> {
  if (region) {
    const data = await fetchFFProfileRegion(uid, region);
    return data ? { data, region } : null;
  }
  for (const r of ALL_REGIONS) {
    const data = await fetchFFProfileRegion(uid, r);
    if (data) return { data, region: r };
  }
  return null;
}

async function registerCommands(token: string, clientId: string): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(token);
  try {
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    logger.info("Commandes slash enregistrées avec succès");
  } catch (err) {
    logger.error({ err }, "Erreur lors de l'enregistrement des commandes slash");
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  logger.info({ tag: client.user?.tag }, "Bot Discord connecté");
});

client.on("interactionCreate", async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = interaction as ChatInputCommandInteraction;

  if (cmd.commandName === "info") {
    const sub = cmd.options.getSubcommand(false);
    if (sub === "profile") {
      try {
        await cmd.deferReply();

        const CHANNEL_KEYWORD = "info-profile-ff";
        const channelName = (cmd.channel as { name?: string } | null)?.name ?? "";
        if (!channelName.includes(CHANNEL_KEYWORD)) {
          await cmd.editReply(
            `❌ Cette commande est réservée au salon contenant **info-profile-ff** dans son nom.\nRendez-vous dans le bon salon pour vérifier un profil Free Fire !`
          );
          return;
        }

        const uid = cmd.options.getString("id", true).trim();
        const regionInput = cmd.options.getString("region") ?? null;

        const result = await fetchFFProfile(uid, regionInput);

        if (!result) {
          await cmd.editReply(
            `❌ Joueur introuvable avec l'ID **${uid}**.\n` +
            `Vérifie que l'ID est correct. Si le joueur existe, précise sa région manuellement.`
          );
          return;
        }

        const { data } = result;
        const acc = data["AccountInfo"] as Record<string, unknown>;
        const accProfile = data["AccountProfileInfo"] as Record<string, unknown> | undefined;
        const guild = data["GuildInfo"] as Record<string, unknown> | undefined;
        const captain = data["captainBasicInfo"] as Record<string, unknown> | undefined;
        const social = data["socialinfo"] as Record<string, unknown> | undefined;
        const credit = data["creditScoreInfo"] as Record<string, unknown> | undefined;

        const name        = acc["AccountName"] as string;
        const level       = acc["AccountLevel"] as number;
        const exp         = acc["AccountEXP"] as number;
        const likes       = acc["AccountLikes"] as number;
        const brPoints    = acc["BrRankPoint"] as number;
        const csPoints    = acc["CsRankPoint"] as number;
        const createTime  = acc["AccountCreateTime"] as string;
        const lastLogin   = acc["AccountLastLogin"] as string;
        const accountRegion = acc["AccountRegion"] as string;
        const ob          = acc["ReleaseVersion"] as string ?? "?";
        const bpBadges    = acc["AccountBPBadges"] as string ?? "?";
        const avatarId    = acc["AccountAvatarId"] as number ?? "?";
        const bannerId    = acc["AccountBPID"] as number ?? "?";
        const creditScore = credit?.["creditScore"] as number ?? "?";
        const signature   = (social?.["AccountSignature"] as string ?? "").replace(/\[.*?\]/g, "").trim();
        const skills      = accProfile?.["EquippedSkills"] as number[] | undefined;
        const guildName   = guild?.["GuildName"] as string | undefined;
        const guildLevel  = guild?.["GuildLevel"] as number | undefined;
        const guildMembers= guild?.["GuildMember"] as number | undefined;
        const leaderName  = captain?.["nickname"] as string | undefined;
        const leaderUID   = captain?.["accountId"] as string | undefined;
        const leaderLevel = captain?.["level"] as number | undefined;
        const leaderExp   = captain?.["exp"] as number | undefined;
        const leaderLogin = captain?.["lastLoginAt"] as string | undefined;
        const leaderBR    = captain?.["rank"] as number | undefined;
        const leaderCS    = captain?.["csRank"] as number | undefined;

        const skillsStr = skills ? skills.filter((_, i) => i % 4 === 1).join(", ") : "?";

        let msg = `\`\`\`\n`;
        msg += `Player Information\n`;
        msg += `┌ ACCOUNT BASIC INFO\n`;
        msg += `├── Name: ${name}\n`;
        msg += `├── UID: ${uid}\n`;
        msg += `├── Level: ${level} (Exp: ${exp.toLocaleString()})\n`;
        msg += `├── Region: ${getRegionFlag(accountRegion)}\n`;
        msg += `├── Likes: ${likes.toLocaleString()}\n`;
        msg += `├── Honor Score: ${creditScore}\n`;
        if (signature) msg += `└── Signature: "${signature.slice(0, 80)}"\n`;
        msg += `┌ ACCOUNT ACTIVITY\n`;
        msg += `├── Most Recent OB: ${ob}\n`;
        msg += `├── Current BP Badges: ${bpBadges}\n`;
        msg += `├── BR Rank: ${brPoints}\n`;
        msg += `├── CS Rank: ${csPoints}\n`;
        msg += `├── Created At: ${formatTimestamp(createTime)}\n`;
        msg += `└── Last Login: ${formatTimestamp(lastLogin)}\n`;
        msg += `┌ ACCOUNT OVERVIEW\n`;
        msg += `├── Avatar ID: ${avatarId}\n`;
        msg += `├── Banner ID: ${bannerId}\n`;
        if (skillsStr) msg += `└── Equipped Skills: [${skillsStr}]\n`;
        if (guildName) {
          msg += `┌ GUILD INFO\n`;
          msg += `├── Guild Name: ${guildName}\n`;
          msg += `├── Guild Level: ${guildLevel}\n`;
          msg += `└── Members: ${guildMembers}\n`;
        }
        if (leaderName) {
          msg += `└ Leader Info:\n`;
          msg += `  ├── Leader Name: ${leaderName}\n`;
          msg += `  ├── Leader UID: ${leaderUID}\n`;
          msg += `  ├── Leader Level: ${leaderLevel} (Exp: ${leaderExp?.toLocaleString()})\n`;
          if (leaderLogin) msg += `  ├── Last Login: ${formatTimestamp(leaderLogin)}\n`;
          msg += `  ├── BR Rank: ${leaderBR}\n`;
          msg += `  └── CS Rank: ${leaderCS}\n`;
        }
        msg += `\`\`\``;
        msg += `\n> 💡 Sensi Gaming | \`/info profile\``;

        await cmd.editReply(msg);
      } catch (err) {
        logger.error({ err }, "Erreur /info profile");
        try { await cmd.editReply("❌ Une erreur est survenue. Réessaie."); } catch {}
      }
    }
    return;
  }

  if (cmd.commandName === "checkban") {
    try {
      await cmd.deferReply();

      const channelName = (cmd.channel as { name?: string } | null)?.name ?? "";
      if (!channelName.includes("check-ban")) {
        await cmd.editReply(
          `❌ Cette commande est réservée au salon **check-ban**.\nRendez-vous dans le bon salon pour vérifier un compte Free Fire !`
        );
        return;
      }

      const uid = cmd.options.getString("id", true).trim();
      const regionInput = cmd.options.getString("region") ?? null;

      const result = await fetchFFProfile(uid, regionInput);

      if (!result) {
        await cmd.editReply(
          `❌ Joueur introuvable avec l'ID **${uid}**.\n` +
          `Vérifie que l'ID est correct. Si le joueur existe, précise sa région manuellement.`
        );
        return;
      }

      const { data, region } = result;
      const acc = data["AccountInfo"] as Record<string, unknown>;

      const name       = acc["AccountName"] as string ?? "?";
      const lastLogin  = acc["AccountLastLogin"] as string | undefined;
      const isBanned   = acc["AccountBanned"] as number ?? 0;
      const banType    = acc["BanType"] as string | undefined;
      const banEnd     = acc["BanEndTime"] as string | undefined;
      const banStart   = acc["BanStartTime"] as string | undefined;

      const lastLoginStr = lastLogin ? formatTimestamp(lastLogin) : "?";
      const regionLabel  = getRegionFlag(region);

      const baseUrl = (() => {
        const domains = process.env["REPLIT_DOMAINS"] ?? "";
        const first = domains.split(",")[0]?.trim();
        return first ? `https://${first}` : "";
      })();
      const imgNotBanned = baseUrl ? `${baseUrl}/api/images/not-banned.png` : "";
      const imgBanned    = baseUrl ? `${baseUrl}/api/images/banned.png`     : "";

      if (!isBanned || isBanned === 0) {
        const embed = new EmbedBuilder()
          .setColor(0x2ecc71)
          .setTitle("🟢 Clean Account")
          .addFields(
            { name: "Status",       value: "No cheat detected",  inline: false },
            { name: "Nickname",     value: name,                  inline: true },
            { name: "Player UID",   value: uid,                   inline: true },
            { name: "Last Login",   value: lastLoginStr,          inline: false },
            { name: "Region",       value: regionLabel,           inline: true },
          )
          .setFooter({ text: "Sensi Gaming | /checkban" })
          .setTimestamp();

        if (imgNotBanned) embed.setImage(imgNotBanned);

        await cmd.editReply({ embeds: [embed] });
      } else {
        const isPermanent = !banEnd || banType?.toLowerCase().includes("perm");
        const title = isPermanent ? "🔴 Permanently Banned !" : "🟠 Temporarily Banned !";
        const color = isPermanent ? 0xe74c3c : 0xe67e22;

        const banEndStr   = banEnd   ? formatTimestamp(banEnd)   : "?";
        const banStartStr = banStart ? formatTimestamp(banStart) : "?";

        let timeRemaining = "?";
        if (banEnd) {
          const msLeft = parseInt(banEnd) * 1000 - Date.now();
          if (msLeft > 0) {
            const days  = Math.floor(msLeft / 86400000);
            const hours = Math.floor((msLeft % 86400000) / 3600000);
            timeRemaining = days > 0 ? `${days} jour(s) ${hours}h` : `${hours}h`;
          } else {
            timeRemaining = "Expiré";
          }
        }

        const embed = new EmbedBuilder()
          .setColor(color)
          .setTitle(title)
          .addFields(
            { name: "Nickname",         value: name,          inline: true },
            { name: "Player UID",       value: uid,           inline: true },
            { name: "Region",           value: regionLabel,   inline: false },
          );

        if (!isPermanent) {
          embed.addFields(
            { name: "Ban Start",        value: banStartStr,   inline: true },
            { name: "Ban End",          value: banEndStr,     inline: true },
            { name: "Time Remaining",   value: timeRemaining, inline: false },
          );
        }

        if (imgBanned) embed.setImage(imgBanned);
        embed.setFooter({ text: "Sensi Gaming | /checkban" }).setTimestamp();

        await cmd.editReply({ embeds: [embed] });
      }
    } catch (err) {
      logger.error({ err }, "Erreur /checkban");
      try { await cmd.editReply("❌ Une erreur est survenue. Réessaie."); } catch {}
    }
    return;
  }

  if (cmd.commandName !== "sensi") return;

  const sub = cmd.options.getSubcommand(false);

  try {
    await cmd.deferReply();

    if (sub === "sensibilidade") {
      const telefone = cmd.options.getString("telefone", true);
      const resultat = trouverModele(telefone);

      if (!resultat) {
        await cmd.editReply(
          `❌ Modèle **${telefone}** non reconnu.\n` +
          `Essaie avec le nom exact, ex: \`iPhone 11\`, \`Galaxy A54\`, \`Redmi Note 12\`, \`Moto G9\`...\n` +
          `Tape \`/sensi marcas\` pour voir toutes les marques supportées.`
        );
        return;
      }

      const { marque, modele } = resultat;
      const sensi = genererSensi(modele);

      await cmd.editReply(
        `🔥 **Sensibilidades Free Fire — ${modele}** (${marque})\n\n` +
        `⚙️ **Geral :** \`${sensi.geral}\`\n` +
        `🔴 **Ponto Vermelho :** \`${sensi.pontoVermelho}\`\n` +
        `🔭 **Mira 2x :** \`${sensi.mira2x}\`\n` +
        `🔭 **Mira 4x :** \`${sensi.mira4x}\`\n` +
        `🕹️ **Tamanho do Botão :** \`${sensi.tamanhoBotao}\`\n\n` +
        `> 💡 Sensi Gaming | \`/sensi sensibilidade\``
      );
      return;
    }

    if (sub === "marcas") {
      await cmd.editReply(
        `📱 **Marques supportées (${TOUTES_MARQUES.length}) :**\n\n` +
        TOUTES_MARQUES.map((m) => `• **${m}** — ${MODELOS[m]!.length - 1} modèles`).join("\n") +
        `\n\nUtilise \`/sensi sensibilidade\` avec le modèle exact de ton téléphone 🎮`
      );
      return;
    }

    if (sub === "aide") {
      await cmd.editReply(
        "📋 **Aide Sensi Gaming**\n\n" +
        "`/sensi sensibilidade` — Sensibilités Free Fire pour ton téléphone\n" +
        "`/sensi marcas` — Voir toutes les marques supportées\n" +
        "`/sensi aide` — Afficher ce menu\n" +
        "`/sensi info` — Infos sur le bot\n" +
        "`/sensi ping` — Latence du bot"
      );
      return;
    }

    if (sub === "info") {
      await cmd.editReply(
        "ℹ️ **Sensi Gaming Bot**\n" +
        "Version : 2.0.0\n" +
        `📱 Marques : ${TOUTES_MARQUES.join(", ")}\n` +
        "Jeu : 🔥 Free Fire\n" +
        "Créé pour la communauté Sensi Gaming 🎮"
      );
      return;
    }

    if (sub === "ping") {
      const latence = client.ws.ping;
      await cmd.editReply(`🏓 Pong ! Latence : **${latence}ms**`);
      return;
    }
  } catch (err) {
    logger.error({ err }, "Erreur lors du traitement de la commande");
    try {
      await cmd.editReply("❌ Une erreur est survenue. Réessaie dans quelques secondes.");
    } catch {
      // interaction already expired
    }
  }
});

export function startBot(): void {
  const token = process.env["DISCORD_TOKEN"];
  const clientId = process.env["DISCORD_CLIENT_ID"];

  if (!token) {
    logger.error("DISCORD_TOKEN manquant — le bot Discord ne démarrera pas.");
    return;
  }

  if (!clientId) {
    logger.error("DISCORD_CLIENT_ID manquant — le bot Discord ne démarrera pas.");
    return;
  }

  registerCommands(token, clientId).then(() => {
    client.login(token).catch((err) => {
      logger.error({ err }, "Échec de connexion du bot Discord");
    });
  });
}
