'use strict';
const Mailjet = require('node-mailjet')
function sendForgotPasswordMail(data, host, resetLink) {

    const mailjet = Mailjet.apiConnect(
        "14b01b92b48d80179df6b4e00c97ff55",
        "606cdd01f57c11d8c45d35bf6515d308",
    );
    const request = mailjet
        .post('send', { version: 'v3.1' })
        .request({
            Messages: [
                {
                    From: {
                        Email: "vudinhdai03092001@gmail.com",
                        Name: "DGB"
                    },
                    To: [
                        {
                            Email: data.email,
                            Name: `${data.username}`
                        }
                    ],
                    Subject: "DGB Reset PassWord",
                    HTMLPart: `
                  <p>Hi ${data.username},</p>  
                    
                 <p> You recently requested to reset the password for your ${host} account. Click the button below to proceed.</P>  
                    
                <p> <a href = "${resetLink}">resetpass</a></p>
                    
                  <p>  If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 30 minutes.
                    </p>
                    Thanks, 
                    DGB
                    `
                }
            ]
        })

    return request

}
module.exports = { sendForgotPasswordMail };