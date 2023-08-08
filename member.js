function skillsMember() {
  const member = document.querySelector(".member");
  const memberBtn = document.querySelector(".member__btn");
  const memberClose = document.querySelector(".member__close");
  memberBtn.addEventListener("click", function () {
    member.classList.add("member--active");
  });
  memberClose.addEventListener("click", function () {
    member.classList.remove("member--active");
  });
}