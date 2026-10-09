export type ContentKind = "story" | "event" | "discipline" | "product";

export interface ContentItem {
  id: string;
  kind: ContentKind;
  title: string;
  category: string;
  description: string;
  image: string;
  imageAlt: string;
  meta: string;
  body: string[];
  flavor?: "chocolate" | "vanilla";
}

const editorial = (name: string) => `/images/editorial/${name}.webp`;

export const products: ContentItem[] = [
  {
    id: "chocolate", kind: "product", title: "Chocolate\nProtein Shake", category: "PERFORMANCE NUTRITION",
    description: "Rich chocolate. Individually packed. Ready for your next moment.",
    image: "/images/nukitis-chocolate-640.webp", imageAlt: "NUKITIS Chocolate box and individual sachets",
    meta: "20 individual servings", flavor: "chocolate",
    body: ["Meet the Chocolate Protein Shake: the original black-and-gold NUKITIS campaign, with 35 g protein and 20 individually packed servings.", "The box contains 20 × 40 g sachets. For ingredients, preparation instructions, dietary suitability, pricing, and availability, consult the product label and the official NUKITIS store."],
  },
  {
    id: "vanilla", kind: "product", title: "Vanilla\nProtein Shake", category: "PERFORMANCE NUTRITION",
    description: "A smooth vanilla moment. The same on-demand format.",
    image: "/images/nukitis-vanilla-640.webp", imageAlt: "NUKITIS Vanilla box and individual sachets",
    meta: "20 individual servings", flavor: "vanilla",
    body: ["Discover the Vanilla Protein Shake. The gold-and-cream composition brings a second flavor to the same NUKITIS performance collection.", "Each box contains 20 × 40 g individual servings. Read the official product label for ingredients and preparation instructions; nutritional suitability depends on your individual needs."],
  },
  {
    id: "chocolate-sachet", kind: "product", title: "Chocolate\nOn the go", category: "INDIVIDUAL SERVINGS",
    description: "Your chocolate serving, wherever the day takes you.",
    image: "/images/nukitis-chocolate-sachet.webp", imageAlt: "Original standing NUKITIS Chocolate sachet",
    meta: "1 serving · 40 g", flavor: "chocolate",
    body: ["One individual Chocolate sachet from the 20-serving box. Keep the original label and preparation directions with your serving.", "The individual-serving format is shown for convenience. Separate sachet retail availability has not been confirmed; check the official store."],
  },
  {
    id: "vanilla-sachet", kind: "product", title: "Vanilla\nOn the go", category: "INDIVIDUAL SERVINGS",
    description: "A single vanilla serving. A little more possibility.",
    image: "/images/nukitis-vanilla-sachet.webp", imageAlt: "Original standing NUKITIS Vanilla sachet",
    meta: "1 serving · 40 g", flavor: "vanilla",
    body: ["A close look at the individual Vanilla sachet from the 20-serving box.", "This is a format preview, not a separate retail offer. Confirm product availability, ingredients, and directions in the official NUKITIS store."],
  },
];

export const stories: ContentItem[] = [
  {
    id: "next-mile", kind: "story", title: "The next mile starts before the first step",
    category: "RUNNING", description: "Small preparations can make room for a more consistent routine.",
    image: editorial("story-running"), imageAlt: "Runner crossing a mountain trail at sunset",
    meta: "4 min read", body: ["Consistency does not need a dramatic beginning. Start with a route you know, a pace you can hold, and enough time to enjoy being outside.", "Lay out your kit before you go. Check the weather and take water when you need it. Planning a simple post-session meal or snack is another way to make the routine easier to repeat.", "The goal is not to win every run. It is to build a rhythm that belongs to you. Training and nutrition needs vary; seek qualified guidance for your own goals."],
  },
  {
    id: "strength", kind: "story", title: "Strong foundations. Bigger possibilities.",
    category: "TRAINING", description: "Make room for technique, patience, and a little more progress.",
    image: editorial("story-strength"), imageAlt: "Strength athlete performing a one-arm dumbbell row in a gym",
    meta: "3 min read", body: ["A good strength session begins with control. Choose movements you understand and a load that lets you keep your technique steady.", "Progress can mean a cleaner repetition, a more comfortable range of motion, or showing up again next week. More is not always better.", "If you are starting a new program, work with a qualified coach. This editorial introduction is not a personalized training plan."],
  },
  {
    id: "routine", kind: "story", title: "Build a routine that moves with you",
    category: "EVERYDAY PERFORMANCE", description: "Preparation, movement, and recovery, on your own terms.",
    image: editorial("story-routine"), imageAlt: "Athlete tying his training shoes beside a gym bag and shaker",
    meta: "5 min read", body: ["A routine is useful when it fits real life. Pick a small number of sessions you can realistically keep, rather than filling every free hour.", "Leave space for rest, meals, and the unexpected. Individually packed nutrition can be convenient, but supplements do not replace a balanced, varied diet.", "Review what worked at the end of the week. Keep the useful parts. Adjust the rest. Sustainable performance starts with a routine you can return to."],
  },
  {
    id: "ride", kind: "story", title: "A different view from the saddle",
    category: "CYCLING", description: "Sometimes the best route is the one that takes you a little further.",
    image: editorial("story-cycling"), imageAlt: "Cyclist riding along a winding mountain road at sunset",
    meta: "4 min read", body: ["A ride can be an adventure without being a race. Explore a familiar road at a different time of day, or choose a new loop with a safe return route.", "Check your bike, wear appropriate safety equipment, and plan your hydration and food around the conditions and length of your ride.", "Give yourself time to take in the view. The experience is part of the reason to go."],
  },
  {
    id: "recovery", kind: "story", title: "The moments between the efforts",
    category: "RECOVERY", description: "Why your off days deserve a place in the plan, too.",
    image: editorial("story-recovery"), imageAlt: "Athlete resting on a mountain overlook after training",
    meta: "3 min read", body: ["Recovery is part of training, not a gap in it. Sleep, regular meals, and time away from hard sessions all deserve attention.", "A relaxed walk or gentle movement may suit some days. On others, doing less is the right choice. Listen to your body and seek professional advice for persistent discomfort.", "The best routine leaves enough space to arrive at the next session ready to participate."],
  },
];

export const upcomingEvents: ContentItem[] = [
  {
    id: "run-club", kind: "event", title: "NUKITIS Run Club", category: "RUNNING",
    description: "A shared route. A fresh perspective.", image: editorial("event-run-club"),
    imageAlt: "Group of runners training together beside a river at sunset",
    meta: "Dates to be announced", body: ["A concept for a community run built around an approachable route, a conversational pace, and a welcoming finish.", "This is an event-format preview. No event, date, location, registration, or NUKITIS athlete partnership is currently announced on this website."],
  },
  {
    id: "training-session", kind: "event", title: "The Next Level Session", category: "TRAINING",
    description: "Find your focus. Share the effort.", image: editorial("event-training-session"),
    imageAlt: "Coach leading athletes through a group strength session",
    meta: "Dates to be announced", body: ["A proposed group-session format centered on technique, accessible challenges, and community.", "The format is illustrative only. Confirmed schedules, qualified coaches, locations, and registration details can be added when available."],
  },
];

export const pastEvents: ContentItem[] = [
  {
    id: "community-preview", kind: "event", title: "Community moments", category: "COMMUNITY",
    description: "A space for the stories we will share.", image: editorial("event-community"),
    imageAlt: "Training group relaxing together after an outdoor session",
    meta: "Archive preview", body: ["This archive is ready for future NUKITIS event recaps.", "No past events or attendance figures have been invented. Replace this clearly labeled preview with a verified event recap and licensed media when available."],
  },
];

export const disciplines: ContentItem[] = [
  { id: "running-discipline", kind: "discipline", title: "Go the distance", category: "RUNNING", description: "One step. Then another.", image: editorial("athlete-running"), imageAlt: "Runner tying his shoes before an outdoor training session", meta: "Running", body: ["A dedicated space for the runners of the NUKITIS world.", "Build a rhythm that belongs to you, one considered session at a time."] },
  { id: "strength-discipline", kind: "discipline", title: "Build your strength", category: "STRENGTH", description: "Progress on your own terms.", image: editorial("athlete-strength"), imageAlt: "Strength athlete holding dumbbells in a dark gym", meta: "Strength", body: ["A space for technique, training, and the people behind the effort.", "Control, patience, and consistency make strong foundations."] },
  { id: "cycling-discipline", kind: "discipline", title: "Take the long way", category: "CYCLING", description: "Find a new perspective.", image: editorial("athlete-cycling"), imageAlt: "Cyclist standing with a road bicycle in the mountains", meta: "Cycling", body: ["A home for the rides and riders of NUKITIS.", "Sometimes the best route is the one that shows you a different view."] },
  { id: "outdoors-discipline", kind: "discipline", title: "Beyond the everyday", category: "OUTDOORS", description: "Make room for adventure.", image: editorial("athlete-outdoors"), imageAlt: "Trail athlete climbing through a mountain landscape", meta: "Outdoors", body: ["A place for movement beyond the familiar route.", "Step outside, choose your line, and make room for adventure."] },
  { id: "everyday-discipline", kind: "discipline", title: "Make it your moment", category: "EVERYDAY", description: "Everyday movement counts.", image: editorial("athlete-everyday"), imageAlt: "Athlete overlooking a mountain lake at sunset", meta: "Everyday performance", body: ["Movement takes many forms. This collection has room for all of them.", "Everyday performance begins with a moment you decide to use well."] },
];

export const infoItems: ContentItem[] = [
  { id: "servings", kind: "product", title: "20 individual servings", category: "NUKITIS", description: "A format designed to move with your day.", image: products[0].image, imageAlt: products[0].imageAlt, meta: "20 × 40 g", body: ["Chocolate and Vanilla are shown in 20-serving boxes. Each serving is individually packed in a 40 g sachet.", "For exact ingredients, directions, availability, and nutrition information, read the official label and visit the NUKITIS store."] },
  { id: "events-intro", kind: "event", title: "A community in motion", category: "COMMUNITY", description: "A space for future NUKITIS events.", image: editorial("event-community"), imageAlt: "Athletes sharing a relaxed moment after training", meta: "Concept preview", body: ["This section presents possible community-event formats, not confirmed bookings.", "Dates, venues, organizers, ticket links, and recaps can be added once events are officially announced."] },
  { id: "athletes-intro", kind: "discipline", title: "Performance has many faces", category: "ATHLETES & DISCIPLINES", description: "Running, strength, cycling, and the outdoors.", image: editorial("athlete-running"), imageAlt: "Runner preparing for an outdoor training session", meta: "Editorial preview", body: ["Explore disciplines and original editorial introductions to movement.", "Running, strength, cycling, and outdoor performance each bring a different perspective."] },
  { id: "privacy", kind: "story", title: "Privacy & this website", category: "INFORMATION", description: "A straightforward frontend experience.", image: "", imageAlt: "", meta: "", body: ["This implementation does not include analytics, advertising trackers, account creation, or form submission to a server. Search runs locally in your browser.", "The official store is an external website with its own policies. This page is not a substitute for a published company privacy policy; approved legal documents should be linked before a commercial launch."] },
  { id: "accessibility", kind: "story", title: "Accessibility", category: "INFORMATION", description: "An experience designed for more people.", image: "", imageAlt: "", meta: "", body: ["Navigation and cards are keyboard accessible. Dialogs keep focus within their content and return it when closed. Horizontal rails support arrow keys and touch scrolling.", "Product navigation supports buttons, keyboard input, dragging, and touch swipes. Reduced-motion preferences disable large movement and smooth scrolling."] },
  { id: "media-info", kind: "story", title: "NUKITIS campaign media", category: "INFORMATION", description: "A consistent world of movement and performance.", image: "", imageAlt: "", meta: "", body: ["Product compositions use the supplied NUKITIS artwork. Sports, event, and athlete sections use the campaign imagery supplied for this implementation.", "The image crops are optimized for the responsive card, banner, and detail layouts."] },
  { id: "brand-info", kind: "story", title: "Swiss Nutrition Technology", category: "NUKITIS", description: "Swiss precision. No compromise.", image: products[1].image, imageAlt: products[1].imageAlt, meta: "", body: ["NUKITIS brings Chocolate and Vanilla into one performance-nutrition campaign.", "Brand and packaging text here follows the supplied artwork. No additional certifications, clinical claims, athlete partnerships, or manufacturing details have been invented."] },
];

export const allContent = [...products, ...stories, ...upcomingEvents, ...pastEvents, ...disciplines, ...infoItems];

function media(item: ContentItem, portrait = false): string {
  return `<div class="card__media${portrait ? " card__media--portrait" : ""}"><img src="${item.image}" width="${portrait ? 1086 : 1536}" height="${portrait ? 1448 : 1024}" alt="${item.imageAlt}" loading="lazy" decoding="async" /></div>`;
}

export function renderCard(item: ContentItem): string {
  if (item.kind === "product") {
    const route = `/products/${item.flavor ?? "chocolate"}`;
    return `<article class="content-card product-card"><a class="card__link" href="${route}" data-route="${route}" aria-label="Explore NUKITIS ${item.flavor === "vanilla" ? "Vanilla" : "Chocolate"}"><h3>${item.title.replace("\n", "<br>")}</h3><div class="product-card__art"><img src="${item.image}" width="640" height="591" alt="${item.imageAlt}" loading="lazy" decoding="async" /></div><p>${item.meta} <span aria-hidden="true">&#8594;</span></p></a></article>`;
  }
  if (item.kind === "discipline") {
    return `<article class="content-card discipline-card"><button class="card__link" type="button" data-detail="${item.id}">${media(item, true)}<div class="discipline-card__avatar" aria-hidden="true"><img src="${item.image}" alt="" loading="lazy" /></div><div class="discipline-card__body"><span class="card__category">${item.category}</span><h3>${item.title}</h3><p>${item.description}</p></div></button></article>`;
  }
  if (item.kind === "event") {
    return `<article class="content-card event-card"><button class="card__link" type="button" data-detail="${item.id}">${media(item)}<div class="card__body"><h3>${item.title}</h3><p class="event-card__date"><span aria-hidden="true">&#9633;</span> ${item.meta}</p><p class="event-card__location">${item.description}</p><span class="card__category">${item.category}</span></div><div class="event-card__status"><span aria-hidden="true">&#9671;</span> ${item.id === "community-preview" ? "Archive preview" : "Format preview"}</div></button></article>`;
  }
  return `<article class="content-card story-card"><button class="card__link" type="button" data-detail="${item.id}">${media(item)}<div class="card__body"><h3>${item.title}</h3><p class="card__description">${item.description}</p><div class="card__meta"><span class="card__category">${item.category}</span><span>${item.meta}</span></div></div></button></article>`;
}

export function renderContent() {
  const render = (id: string, items: ContentItem[]) => {
    document.getElementById(id)!.innerHTML = items.map(renderCard).join("");
  };
  render("nutrition-track", products);
  render("stories-track", stories);
  render("events-track", upcomingEvents);
  render("performance-track", disciplines);
  const discovery = [upcomingEvents[0], stories[1], upcomingEvents[1], stories[3], stories[4], disciplines[0], stories[0], products[0], stories[2], disciplines[2], products[1], pastEvents[0]];
  render("world-grid", discovery);
  document.getElementById("menu-products")!.innerHTML = products.slice(0, 2).map(item =>
    `<a href="/products/${item.flavor}" data-route="/products/${item.flavor}"><img src="${item.image}" alt="${item.imageAlt}" width="180" height="166" /><span>${item.title.replace("\n", " ")}</span></a>`,
  ).join("");

  const tabs = [...document.querySelectorAll<HTMLButtonElement>("[data-events]")];
  const selectEvents = (selected: HTMLButtonElement) => {
    tabs.forEach(tab => {
      tab.setAttribute("aria-selected", String(tab === selected));
      tab.tabIndex = tab === selected ? 0 : -1;
    });
    document.getElementById("events-panel")!.setAttribute("aria-labelledby", selected.id);
    render("events-track", selected.dataset.events === "past" ? pastEvents : upcomingEvents);
    document.getElementById("events-track")!.scrollLeft = 0;
    document.dispatchEvent(new CustomEvent("nukitis:rail-update"));
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectEvents(tab));
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? tabs[0] : event.key === "End" ? tabs.at(-1)! : tabs[(index + 1) % tabs.length];
      selectEvents(next);
      next.focus();
    });
  });
  const more = document.querySelector<HTMLButtonElement>(".load-more")!;
  more.addEventListener("click", () => {
    document.getElementById("world-grid")!.insertAdjacentHTML("beforeend", [disciplines[1], stories[3], products[2], stories[4]].map(renderCard).join(""));
    more.disabled = true;
    more.textContent = "You're all caught up";
    document.getElementById("load-status")!.textContent = "Four more NUKITIS stories and products loaded.";
  });
  document.getElementById("year")!.textContent = String(new Date().getFullYear());
}
