export class OrderFormPage {
    constructor(page) {
        this.page = page;
        this.toast = this.page.locator(".toast-message");
    }

    get navbarLeft() {
       return this.page.locator(".navbar-nav");
     }

    get navbarSection() {
       return this.navbarLeft.locator(".dropdown");
     }

    get navbarItem() {
       return this.navbarLeft.locator(".dropdown-item");
    }

    get mainContent() {
      return this.page.locator(".main_content");
    }

    get pageHeader() {
      return this.page.locator("h1");
    }

    get contentHeader() {
      return this.mainContent.locator("h3");
    }

    get companyId() {
        return this.mainContent.locator("#ico");
    }

    get client() {
        return this.mainContent.locator("#client");
    }

    get address() {
        return this.mainContent.locator("#address");
    }

    get substitute() {
        return this.mainContent.locator("#substitute");
    }

    get contactName() {
        return this.mainContent.locator("#contact_name");
    }

    get contactPhone() {
        return this.mainContent.locator("#contact_tel");
    }

    get contactEmail() {
        return this.mainContent.locator("#contact_mail");
    }

    get startDate() {
        return this.mainContent.locator("#start_date_1");
    }

    get endDate() {
        return this.mainContent.locator("#end_date_1");
    }

    async getFilledValues() {
        return {
          companyId: await this.companyId.inputValue(),
          client: await this.client.inputValue(),
          address: await this.address.inputValue(),
          substitute: await this.substitute.inputValue(),
          contactName: await this.contactName.inputValue(),
          contactPhone: await this.contactPhone.inputValue(),
          contactEmail: await this.contactEmail.inputValue(),
          startDate: await this.startDate.inputValue(),
          endDate: await this.endDate.inputValue(),
        };
    }

    get tabSelector() {
        return this.mainContent.locator("#nav-tab");
    }

    get submitButton() {
        return this.mainContent.getByRole("button", { name: "Uložit objednávku" });
    }

    get orderConfirmationText() {
        return this.page.locator(".card-body").locator("p");
    }

    get suburbanCampForm() {
        return {
            campDateSelector: this.page.locator("#camp-date_part"),
            numberOfStudentsField: this.page.locator("#camp-students"),
            numberStudentAgeField: this.page.locator("#camp-age"),
            numberNumberOfAdultsField: this.page.locator("#camp-adults"),

            async setUrbanCamp(campDate, students, age, teachers) {
                await this.campDateSelector.selectOption({ label: campDate });
                await this.numberOfStudentsField.fill(students);
                await this.numberStudentAgeField.fill(age);
                await this.numberNumberOfAdultsField.fill(teachers);
            }
        };
    }

    async navigate(sectionText, itemText) {
        await this.navbarSection.filter({ hasText: sectionText }).click();
        await this.navbarItem.filter({ hasText: itemText }).click();
    }

    async setICO(ico) {
        await this.companyId.fill(ico);
        await this.page.keyboard.press("Enter");
        await this.toast.waitFor();
    }

    async selectType(name) {
        await this.tabSelector.getByRole("tab", { name: name }).click();
    }

    async submit() {
        await this.submitButton.click();
    }

    async setUrbanCamp(campDate, students, age, teachers) {
        await this.selectType("Příměstský tábor");
        await this.suburbanCampForm.setUrbanCamp(campDate, students, age, teachers);
    }

    async setOrder(
        substituteName,
        contactName,
        contactPhone,
        contactEmail,
        startDate,
        endDate
    ) {
        await this.substitute.fill(substituteName);
        await this.contactName.fill(contactName);
        await this.contactPhone.fill(contactPhone);
        await this.contactEmail.fill(contactEmail);
        await this.startDate.fill(startDate);
        await this.endDate.fill(endDate);
    }

    async fillNameAndAddress(clientName, address) {
        await this.client.fill(clientName);
        await this.address.fill(address);
    }
}