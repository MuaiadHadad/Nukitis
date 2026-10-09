export function initHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>(".home-hero__video");
  if (!video) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let canAutoplay = false;

  const showVideo = () => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      video.classList.add("is-ready");
    }
  };

  const attemptPlayback = async () => {
    if (reducedMotion.matches || document.hidden) return;
    try {
      await video.play();
      canAutoplay = true;
    } catch {
      canAutoplay = false;
    }
  };

  const applyMotionPreference = () => {
    if (reducedMotion.matches) {
      video.pause();
      video.classList.remove("is-ready");
      return;
    }
    void attemptPlayback();
  };

  video.addEventListener("loadeddata", showVideo, { once: true });
  video.addEventListener("playing", showVideo);
  video.addEventListener("error", () => video.classList.remove("is-ready"));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) video.pause();
    else if (canAutoplay || !reducedMotion.matches) void attemptPlayback();
  });
  reducedMotion.addEventListener("change", applyMotionPreference);
  applyMotionPreference();
}
