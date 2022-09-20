const
  line1 = document.querySelector(".line.l1"),
  line2 = document.querySelector(".line.l2"),
  line3 = document.querySelector(".line.l3"),
  line4 = document.querySelector(".line.l4"),
  hand = document.querySelector(".hand"),
  btn = document.querySelector("button");

btn.addEventListener("click", () => {
  [line1,line2,line3,line4,hand].forEach(line => {
    line.classList.add("animate")
  });
  btn.classList.add("hidden");
});