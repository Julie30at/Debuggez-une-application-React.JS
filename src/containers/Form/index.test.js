import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Form from "./index";

describe("When Events is created", () => {
  it("a list of event card is displayed", async () => {
    render(<Form />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
    it("the success action is called and button text updates", async () => {
      const onSuccess = jest.fn();
      render(<Form onSuccess={onSuccess} />);

      // Vérifier que le bouton affiche "Envoyer" avant le clic
      const submitButton = screen.getByTestId("button-test-id");
      expect(submitButton.value).toBe("Envoyer");

      // Simuler le remplissage des champs requis
      fireEvent.change(screen.getByPlaceholderText("nom"), { target: { value: "Doe" } });
      fireEvent.change(screen.getByPlaceholderText("prénom"), { target: { value: "John" } });

      // Ouvrir le Select et choisir "Personel"
      fireEvent.click(screen.getByTestId("collapse-button-testid")); // Clic pour ouvrir la liste déroulante
      fireEvent.click(screen.getByText("Personel")); // Clic sur l'option "Personel"

      fireEvent.change(screen.getByPlaceholderText("email"), { target: { value: "john.doe@example.com" } });
      fireEvent.change(screen.getByPlaceholderText("écrivez votre message"), { target: { value: "Ceci est un message." } });

      // Simuler le clic sur le bouton
      fireEvent.click(submitButton);

      // Vérifier que le texte "En cours" s'affiche pendant le chargement
      await waitFor(() => {
        expect(submitButton.value).toBe("En cours");
      });

      // Attendre que la fonction de succès soit appelée
      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });

      // Vérifier que le texte "Envoyer" est de nouveau affiché après l'envoi
      await waitFor(() => {
        expect(submitButton.value).toBe("Envoyer");
      });
    });
  });
});
