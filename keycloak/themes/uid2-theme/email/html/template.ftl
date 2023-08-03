<#macro emailLayout>
<html>
<body>
  <div style="padding: 70px; text-align: center; font-family: 'Inter', sans-serif">
    <div style="padding: 20px">
      <a href="${properties.applicationURL}"
        ><img src="${properties.applicationURL}/uid2-logo.svg" alt="UID2 logo" style="height: 30px"
      /></a>
    </div>
    <div style="margin-top: 16px; width:500px; display: inline-block;">
      <#nested>
    </div>
  </div>
</body>
</html>
</#macro>