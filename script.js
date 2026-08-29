const timeline = document.querySelector(".timeline-container");
const progress = document.querySelector(".timeline-progress");

const items = document.querySelectorAll(".timeline-item");

window.addEventListener("scroll", () => {

    /*
      Timeline line growth
    */

    const timelineTop = timeline.offsetTop;
    const timelineHeight = timeline.offsetHeight;

    const scrollPosition =
        window.scrollY + window.innerHeight / 2;

    const percentage =
        ((scrollPosition - timelineTop)
            / timelineHeight) * 100;

    progress.style.height =
        Math.min(Math.max(percentage, 0), 100) + "%";


    /*
      Reveal cards
    */

    items.forEach(item => {

        const rect = item.getBoundingClientRect();

        if(rect.top < window.innerHeight * 0.8){

            item.classList.add("visible");
        }
    });


    /*
      3D Parallax Effect
    */

    items.forEach(item => {

        const card = item.querySelector(".card");
        const image = item.querySelector("img");

        const rect = item.getBoundingClientRect();

        const center =
            window.innerHeight / 2;

        const distance =
            rect.top - center;

        const rotate =
            distance * 0.015;

        card.style.transform =
            `rotateX(${rotate}deg)`;

        image.style.transform =
            `translateY(${distance * 0.08}px) scale(1.1)`;
    });

});
