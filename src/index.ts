import { renderContent } from "./components/content";
import { initNavigation } from "./components/navigation";
import { initRails } from "./components/rails";
import { initDetails } from "./components/details";
import { initScrollMotion } from "./components/scroll-motion";
import { initRouter } from "./components/router";
import { initCommerce, initQuantityControls } from "./components/commerce";
import { initHeroVideo } from "./components/hero-video";

renderContent();
initRouter();
initNavigation();
initRails();
initDetails();
initScrollMotion();
initCommerce();
initQuantityControls();
initHeroVideo();
