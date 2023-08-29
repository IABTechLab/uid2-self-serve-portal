<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <#if messageHeader??>
        ${messageHeader}
        <#else>
        ${message.summary}
        </#if>
    <#elseif section = "form">
    <div id="kc-info-message">
        <p class="instruction">
          <#if requiredActions??>
            <#list requiredActions><#items as reqActionItem>${kcSanitize(msg("requiredAction.${reqActionItem}"))?no_esc}<#sep>, </#items></#list>
          <#elseif message.summary = "Your account has been approved">
            ${msg("accountUpdatedInstruction")}
          </#if>
        </p>

        <#if skipLink??>
        <#else>
            <#if pageRedirectUri?has_content>
              <#if message.summary = "Your account has been approved">
                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                  <a class="${properties.kcButtonClass!} ${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" href="${pageRedirectUri}">${kcSanitize(msg("doLogIn"))?no_esc}</a>
                </div>
              <#else>
              <p><a href="${pageRedirectUri}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
              </#if>
            <#elseif actionUri?has_content>
              <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                <a id="proceedWithAction" class="${properties.kcButtonClass!} ${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" href="${actionUri}">${kcSanitize(msg("proceedWithAction"))?no_esc}</a>
                <script>document.getElementById('proceedWithAction').click()</script>
              </div>
            <#elseif (client.baseUrl)?has_content>
              <p><a href="${client.baseUrl}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
            </#if>
        </#if>
    </div>
    </#if>
</@layout.registrationLayout>