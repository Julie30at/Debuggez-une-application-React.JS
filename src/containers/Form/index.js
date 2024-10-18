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

  const handleInputChange = useCallback((field, value) => {
    setInputValue((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  const sendContact = useCallback(
  async (evt) => {
    evt.preventDefault();
    setSending(true); // Active l'état d'envoi
    setErrorMessage(""); // Réinitialisation du message d'erreur
    setSuccessMessage(""); // Réinitialisation du message de succès

    // Validation des champs du formulaire
    const { firstName, lastName, type, email, message } = inputValue;

    if (!firstName || !lastName || !type || !email || !message) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return; // Arrête l'envoi du formulaire si validation échoue
    }
    try {
      await mockContactApi();

      // Log après un envoi réussi
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
            placeholder=""
            label="Nom"
            value={inputValue.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
          />
          <Field
            name="prenom"
            placeholder=""
            label="Prénom"
            value={inputValue.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
          />
          <Select
            name="selected"
            selection={["Personel", "Entreprise"]}
            value={inputValue.type}
            onChange={(value) => handleInputChange("type", value)} 
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          <Field
            name="e-mail"
            placeholder=""
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
            placeholder=""
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
