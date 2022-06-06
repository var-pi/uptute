export function getId() {
  var result = "ID-";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function goTo(pageName) {
  if (this.$route.name !== pageName) this.$router.push({ name: pageName });
}

export function scrolled({ cards }) {
  const maxZInPx = 4;

  if (cards.length === 0) return;

  const cardsPerPageFloat = window.innerHeight / cards[0].offsetHeight;
  const maxCardsPerPage = Math.floor(cardsPerPageFloat) + 2;
  const firstCardVisiblePart = (cardsPerPageFloat % 1) / 2;
  const centerId = (maxCardsPerPage - 1) / 2; // Ends with .5 if maxCardsPerPage is even. But works nevertheless.

  cards.forEach((card) => {
    const cardFromTop = card.getBoundingClientRect().y;
    const cardHeight = card.offsetHeight;
    const cardCenterFromTop = cardFromTop + cardHeight / 2;

    for (let i = 0; i < maxCardsPerPage; i++) {
      const minFromTop = (i - 1 + firstCardVisiblePart) * cardHeight;
      const maxFromTop = (i + firstCardVisiblePart) * cardHeight;
      if (cardCenterFromTop > minFromTop && cardCenterFromTop < maxFromTop)
        card.style = `transform: perspective(100px) translateZ(${calcZ(i)}px);
        transition: all 1s;`;
      // card.style = ` transform: translateX(${calcZ(i)}%);
      // transition: all 1s;`;
    }
  });

  function sumUpToN(n) {
    return ((1 + n) * n) / 2;
  }

  function calcZ(index) {
    const maxZ = sumUpToN(Math.ceil((maxCardsPerPage - 2) / 2));
    const absIndexFromCenter = Math.abs(index - centerId);
    const zAsPart = (maxZ - sumUpToN(absIndexFromCenter)) / maxZ;
    return maxZInPx * zAsPart;
  }
}

export function rndBtw(start, end) {
  return Math.floor(Math.random() * (end - start + 1) + start);
}

// cards.forEach((card) => {

// const maxFromTop = (window.innerHeight + card.offsetHeight) / 2;
// const minFromTop = (window.innerHeight - card.offsetHeight) / 2;
//   if (cardCenterFromTop > minFromTop && cardCenterFromTop < maxFromTop)
//     card.style =
//       "@include box-shadow-raised(); transform: perspective(100px) translateZ(6px);  transition: all 1s;";
//   else
//     card.style =
//       "transition: all 1s; transform: perspective(1000px) translateZ(0px); ";
// });

export function ruleBase({ self, title, condition, pathEnd, lParams }) {
  if (!condition)
    self[title].errMsg = self.$l(`auth.rules.${pathEnd}`, lParams || {});
  return condition;
}
