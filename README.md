# Google Apps Script Telegram Bot

Host your Telegram BOT on Google App Script.

## Set up

1. Visit **script.google.com/start** to open the script editor.
1. **Delete** any code in the script editor and paste in the code in Code.gs
1. **Replace** var of `token` with your bot token.
1. Select the menu item **File > Save**. Name your new script and click **OK**.
1.  Select **Publish > Deploy as web app**.
1.  Under **Project version**, select **New**.
1.  Under **Execute the app as**, select your account.
1.  Under **Who has access to the app**, select "Anyone, even anonymous".
1.  Click **Deploy**.
1.  In the dialog **Authorization required**, click **Review Permissions** and click **Allow**.
1.  **Copy** the URL labeled **Current web app URL** and ends in **/exec**
1.  **Replace** var of `publishUrl` with your **Current web app URL**
1.  **Set up** the **Webhook** by Select the **Run** menu, select the function **setWebhook**.

## Command List

```bash
/start #begin bot

/joke  #get joke
```


## Thanks to

Original source:
```bash
https://gist.github.com/unnikked/828e45e52e217adc09478321225ec3de
```

Reference:
```bash
- https://github.com/ocordova/gas-telegram-bot
```