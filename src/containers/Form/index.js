import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [inputValue, setInputValue] = useState({
    firstName: "",
    lastName: "",
    type: "",
    email: "",
    message: "",
  });

  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

 const handleInputChange = useCallback((field, value) => {
  // Définit une fonction de gestion d'événements pour la modification d'un champ d'entrée.
  setInputValue((prevState) => ({
    // Met à jour l'état inputValue en utilisant la fonction setInputValue.
    ...prevState, // Copie l'état précédent pour conserver les valeurs des autres champs.
    [field]: value, // Met à jour la valeur du champ spécifié (field) avec la nouvelle valeur (value).
  }));
}, []);
// useCallback est utilisé pour mémoriser la fonction handleInputChange afin qu'elle ne soit pas recréée à chaque rendu.
// Le tableau de dépendances est vide ([]), donc la fonction ne sera créée qu'une seule fois, lors du premier rendu.

  const sendContact = useCallback(
  async (evt) => {
    evt.preventDefault();
 
    setErrorMessage(""); // Réinitialisation du message d'erreur
    setSuccessMessage(""); // Réinitialisation du message de succès

    // Validation des champs du formulaire
    const { firstName, lastName, type, email, message } = inputValue;
    const isEmailValid = regexEmail.test(email.toLowerCase())

    if (!firstName || !lastName || !type || !isEmailValid || !message) {
      setErrorMessage(isEmailValid === true ? "Tous les champs sont obligatoires." : "votre adresse mail n'est pas valide.");
      return; // Arrête l'envoi du formulaire si validation échoue
    }
       setSending(true); // Active l'état d'envoi
    try {
      await mockContactApi();

      // Log après un envoi réussi
     // eslint-disable-next-line no-console
     console.log("Envoi réussi, valeurs envoyées :", inputValue);

      setSuccessMessage("Votre message a été envoyé avec succès !");
      onSuccess();

      // Réinitialisation du formulaire
      setInputValue({
        firstName: "",
        lastName: "",
        type: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setErrorMessage(err.message);
      onError(err);
    } finally {
      setSending(false);
    }
  },
  [inputValue, onSuccess, onError]
);
  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            name="nom"
            placeholder="nom"
            label="Nom"
            value={inputValue.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          <Field
            name="prenom"
            placeholder="prénom"
            label="Prénom"
            value={inputValue.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
          <Select
            id="selected"
            name="selected"
            selection={["Personel", "Entreprise"]}
            value={inputValue.type}
            onChange={(value) => handleInputChange("type", value)}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
            placeholder="Choisir"
          />
          <Field
            name="e-mail"
            placeholder="email"
            label="Email"
            value={inputValue.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending} data-testid="button-test-id">
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            name="message"
            placeholder="écrivez votre message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            value={inputValue.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
          />
        </div>
      </div>
      {errorMessage && (
        <div role="alert" style={{ color: "red", marginTop: "10px" }}>
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div role="status" style={{ color: "white", marginTop: "10px" }}>
          {successMessage}
        </div>
      )}
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
