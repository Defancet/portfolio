enum PathEnum {
    HOME = "/",
    ABOUT = "/about",
    EXPERIENCE = "/experience",
    CONTACT = "/contact",
    FORM_SUBMITTED = "/form-submitted",
    NOT_FOUND = "/:pathMatch(.*)*",
}

export default PathEnum;
