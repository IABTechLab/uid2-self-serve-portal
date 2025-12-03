<#macro emailLayout>
<html>
  <head>
    <!-- Developer note - the head and structure is cloned from accountHasBeenConfirmed.hbs. Try to keep things matching to make like-for-like design changes easier. -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <style type="text/css">
      body {
        font-family: Inter;
        font-size: 18px;
        color: #000000;
        background-color: #fff;
      }
      .logo-container {
      }
      .logo {
        height: 30px;
      }
      h1 {
        margin-top: 36px;
        font-size: 22px;
        font-weight: 700;
        text-align: center;
      }
      .header {
        text-align: center;
      }
      .content {
        margin-top: 31px;
        display: inline-block;
      }
      .button {
        border-radius: 5px;
        font-weight: 600;
        font-size: 18px;
        padding: 11px 42px;
        background-color: #cdf200;
        color: #030a40 !important;
        text-decoration: none;
      }
      .content-text {
        text-align: center;
        font-size: 18px;
        font-weight: 400;
      }
      .footer {
        margin: 50px 0 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="content">
      <div class="header">
        <a href="${properties.applicationURL}">
          <img src="${properties.applicationURL}/uid2-logo-email.png" alt="UID2 logo" class="logo"/>
        </a>
      </div>
      <#nested>
    </div>
  </body>
</html>
</#macro>