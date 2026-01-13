<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=false displayMessage=true displayRequiredFields=false; section>
    <#if section = "header">
        ${msg("loginAccountTitle")}
    <#elseif section = "form">
        <form id="kc-form-login" class="${properties.kcFormClass!}" onsubmit="return handleFormSubmit(event);" action="${url.loginAction}" method="post">
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="username" class="${properties.kcLabelClass!}">${msg("email")}</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input 
                        tabindex="1" 
                        id="username" 
                        class="${properties.kcInputClass!}" 
                        name="username" 
                        value="${(auth.attemptedUsername!'')}" 
                        type="email" 
                        autofocus 
                        autocomplete="email" 
                        aria-invalid="<#if messagesPerField.existsError('username')>true</#if>"
                        required
                    />
                    <#if messagesPerField.existsError('username')>
                        <span id="input-error-username" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('username'))?no_esc}
                        </span>
                    </#if>
                </div>
            </div>

            <div id="kc-password-group" class="${properties.kcFormGroupClass!}" style="display: none;">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="password" class="${properties.kcLabelClass!}">${msg("password")}</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input 
                        tabindex="2" 
                        id="password" 
                        class="${properties.kcInputClass!}" 
                        name="password" 
                        type="password" 
                        autocomplete="current-password"
                        aria-invalid="<#if messagesPerField.existsError('password')>true</#if>"
                    />
                    <#if messagesPerField.existsError('password')>
                        <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('password'))?no_esc}
                        </span>
                    </#if>
                </div>
            </div>

            <#if realm.rememberMe && !usernameEditDisabled??>
            <div id="kc-remember-me-group" class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}" style="display: none;">
                <div id="kc-form-options">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <label for="rememberMe" class="checkbox">
                            <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" <#if login?? && login.rememberMe?? && login.rememberMe == 'on'>checked</#if>/>
                            ${msg("rememberMe")}
                        </label>
                    </div>
                </div>
            </div>
            </#if>

            <#if realm.resetPasswordAllowed>
            <div id="kc-forgot-password-group" class="${properties.kcFormOptionsWrapperClass!}" style="display: none;">
                <span><a tabindex="4" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a></span>
            </div>
            </#if>

            <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
                <input 
                    tabindex="5" 
                    class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" 
                    name="login" 
                    id="kc-login" 
                    type="submit" 
                    value="${msg("doNext")}"
                />
            </div>
        </form>

        <script>
            let passwordShown = false;

            function handleFormSubmit(event) {
                const emailInput = document.getElementById('username');
                const email = emailInput.value.trim();
                
                if (!email) {
                    return false;
                }

                // If password field is not shown yet, show it instead of submitting
                if (!passwordShown) {
                    event.preventDefault();
                    showPasswordField(email);
                    return false;
                }

                // If password is shown, allow normal form submission
                return true;
            }

            function showPasswordField(email) {
                // Extract domain from email
                const emailDomain = email.split('@')[1]?.toLowerCase();
                
                // Check if email is from The Trade Desk domain
                if (emailDomain === 'thetradedesk.com') {
                    // TODO: Manager will implement SSO redirect to IdP here
                    // This will be handled by the IdP configuration ticket
                    // Placeholder for SSO redirect logic
                    console.log('The Trade Desk email detected - SSO redirect will be implemented by IdP configuration');
                    // For now, fall through to password entry until SSO is configured
                }

                // Show password field and related elements
                document.getElementById('kc-password-group').style.display = 'block';
                const rememberMeGroup = document.getElementById('kc-remember-me-group');
                if (rememberMeGroup) {
                    rememberMeGroup.style.display = 'block';
                }
                const forgotPasswordGroup = document.getElementById('kc-forgot-password-group');
                if (forgotPasswordGroup) {
                    forgotPasswordGroup.style.display = 'block';
                }

                // Change button text to "Log In"
                const submitButton = document.getElementById('kc-login');
                submitButton.value = 'Log In';

                // Focus on password field
                const passwordInput = document.getElementById('password');
                passwordInput.focus();
                passwordInput.required = true;

                // Disable email field
                document.getElementById('username').readOnly = true;

                passwordShown = true;
            }
        </script>
    </#if>
</@layout.registrationLayout>
