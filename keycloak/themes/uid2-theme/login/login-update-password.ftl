<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('password','password-confirm'); section>
    <#if section = "header">
        ${msg("updatePasswordTitle")}
        <div id="password-error-message" class="kcErrorMessage" style="display:none;">
    <p class="error-text"></p>
</div>
    <#elseif section = "form">
        <form id="kc-passwd-update-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post" onsubmit="return checkPasswordBlacklist()">
            <input type="text" id="username" name="username" value="${username}" autocomplete="username"
                   readonly="readonly" style="display:none;"/>
            <input type="password" id="password" name="password" autocomplete="current-password" style="display:none;"/>
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="password-new" class="${properties.kcLabelClass!}">${msg("passwordNew")}</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="password" id="password-new" name="password-new" class="${properties.kcInputClass!}"
                           autofocus autocomplete="new-password"
                           aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>"
                    />

                    <#if messagesPerField.existsError('password')>
                        <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('password'))?no_esc}
                        </span>
                    </#if>
                </div>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="password-confirm" class="${properties.kcLabelClass!}">${msg("passwordConfirm")}</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="password" id="password-confirm" name="password-confirm"
                           class="${properties.kcInputClass!}"
                           autocomplete="new-password"
                           aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"
                    />

                    <#if messagesPerField.existsError('password-confirm')>
                        <span id="input-error-password-confirm" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
                        </span>
                    </#if>

                </div>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <div class="checkbox">
                            <label><input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" checked /><span>${msg("logoutOtherSessions")}</span></label>
                        </div>
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <#if isAppInitiatedAction??>
                        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doUpdatePassword")}" />
                        <button class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonLargeClass!}" type="submit" name="cancel-aia" value="true" />${msg("doCancel")}</button>
                    <#else>
                        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doUpdatePassword")}" />
                    </#if>
                </div>
            </div>


        <script type="text/javascript">
            let blacklistedPasswords = [];

            function loadBlacklist() {
                // txt file of common passwords recommended to blacklist by NIST
                fetch('https://raw.githubusercontent.com/danielmiessler/SecLists/master/Passwords/Common-Credentials/10-million-password-list-top-1000000.txt')
                    .then(response => response.text())
                    .then(data => {
                        blacklistedPasswords = data.split("\n");
                        // already do not allow length < 8, so makes sense to not include them here
                        blacklistedPasswords = blacklistedPasswords.filter(password => password.length >= 8);
                    })
                    .catch(error => {
                        console.error("could not get blacklist", error);
                    });
            }

            loadBlacklist();     

            let errorMessageDiv;      

            function checkPasswordBlacklist() {
                var password = document.getElementById("password-new").value;
                
                if (blacklistedPasswords.includes(password)) {
                    errorMessageDiv = document.getElementById("password-error-message");
                    let errorText = document.querySelector(".kcErrorMessage .error-text");
                    errorText.textContent = "The password you've entered isn't allowed. Please avoid using commonly used, or easily guessed passwords to keep your account secure.";
                    errorMessageDiv.style.display = "block";
                    return false;
                }
                
                errorMessageDiv = document.getElementById("password-error-message");
                errorMessageDiv.style.display = "none";
                return true; 
            }
        </script>
        </form>
    </#if>
</@layout.registrationLayout>