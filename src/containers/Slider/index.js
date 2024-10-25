import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

 // Tri des événements par ordre croissant
  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? 1 : -1
  ) || []; 

  // Fonction pour passer à la carte suivante
  const nextCard = () => {
    setIndex(index < byDateDesc.length - 1 ? index + 1 : 0);
  };

  // useEffect pour changer automatiquement de carte toutes les 5 secondes
  useEffect(() => {
    const timer = setTimeout(nextCard, 5000);

    return () => clearTimeout(timer); // Nettoyage du timer à chaque mise à jour
  }, [index, byDateDesc.length]); // Ne se déclenche que lorsque l'index ou la longueur des données change

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div key={event.date}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((paginationEvent, radioIdx) => (
            <input
              key={paginationEvent.date} 
              type="radio"
              name="radio-button"
              checked={index === radioIdx} 
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
