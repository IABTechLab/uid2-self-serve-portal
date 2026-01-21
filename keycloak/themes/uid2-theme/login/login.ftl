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

            <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
                <input 
                    tabindex="4" 
                    class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" 
                    name="login" 
                    id="kc-login" 
                    type="submit" 
                    value="${msg("doNext")}"
                />
            </div>

            <#if realm.resetPasswordAllowed>
            <div id="kc-forgot-password-group" class="${properties.kcFormOptionsWrapperClass!}" style="display: none;">
                <span><a tabindex="5" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a></span>
            </div>
            </#if>

            <div id="kc-back-button-group" class="${properties.kcFormOptionsWrapperClass!}" style="display: none;">
                <span><a tabindex="6" href="javascript:void(0);" onclick="hidePasswordField(); return false;"><span style="color: #666;">←</span> Back to Previous Page</a></span>
            </div>
        </form>

        <script>
            let passwordShown = false;

            // SSO domain to IdP alias mapping
            // Key: email domain (lowercase), Value: Keycloak IdP alias
            const ssoDomainsToIdp = {
                'unifiedid.com': 'okta-unifiedid',
                'thetradedesk.com': 'microsoft-entra-id'
            };

            function handleFormSubmit(event) {
                const emailInput = document.getElementById('username');
                const email = emailInput.value.trim();
                
                if (!email) {
                    return false;
                }

                // Check for SSO redirect before showing password
                const emailDomain = email.split('@')[1]?.toLowerCase();
                if (emailDomain && ssoDomainsToIdp[emailDomain]) {
                    event.preventDefault();
                    redirectToIdp(ssoDomainsToIdp[emailDomain], email);
                    return false;
                }

                // Show password if not shown (for non-SSO domains)
                if (!passwordShown) {
                    event.preventDefault();
                    showPasswordField(email);
                    return false;
                }

                // If password is shown, allow normal form submission
                return true;
            }

            function redirectToIdp(idpAlias, loginHint) {
                // Build the IdP redirect URL using Keycloak's kc_idp_hint parameter
                const currentUrl = new URL(window.location.href);
                const params = new URLSearchParams(currentUrl.search);
                
                // Preserve existing parameters and add IdP hint
                params.set('kc_idp_hint', idpAlias);
                
                // Optionally pass login_hint so Okta pre-fills the email
                if (loginHint) {
                    params.set('login_hint', loginHint);
                }
                
                // Redirect to the same auth endpoint with IdP hint
                currentUrl.search = params.toString();
                window.location.href = currentUrl.toString();
            }

            function showPasswordField(email) {
                // No longer need SSO check here - it's handled in handleFormSubmit

                document.getElementById('kc-password-group').style.display = 'block';
                const rememberMeGroup = document.getElementById('kc-remember-me-group');
                if (rememberMeGroup) {
                    rememberMeGroup.style.display = 'block';
                }
                const forgotPasswordGroup = document.getElementById('kc-forgot-password-group');
                if (forgotPasswordGroup) {
                    forgotPasswordGroup.style.display = 'block';
                }
                
                document.getElementById('kc-back-button-group').style.display = 'block';
                const submitButton = document.getElementById('kc-login');
                submitButton.value = 'Log In';

                const passwordInput = document.getElementById('password');
                passwordInput.focus();
                passwordInput.required = true;

                document.getElementById('username').readOnly = true;

                passwordShown = true;
            }

            function hidePasswordField() {
                document.getElementById('kc-password-group').style.display = 'none';
                const rememberMeGroup = document.getElementById('kc-remember-me-group');
                if (rememberMeGroup) {
                    rememberMeGroup.style.display = 'none';
                }
                const forgotPasswordGroup = document.getElementById('kc-forgot-password-group');
                if (forgotPasswordGroup) {
                    forgotPasswordGroup.style.display = 'none';
                }

                document.getElementById('kc-back-button-group').style.display = 'none';

                const submitButton = document.getElementById('kc-login');
                submitButton.value = 'Next';

                const emailInput = document.getElementById('username');
                emailInput.readOnly = false;
                emailInput.focus();

                const passwordInput = document.getElementById('password');
                passwordInput.value = '';
                passwordInput.required = false;

                passwordShown = false;
            }
        </script>
    </#if>
</@layout.registrationLayout>
