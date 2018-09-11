package com.siertech.stapi.transactional;
import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.Properties;

import javax.mail.*;
import javax.mail.internet.*;
import org.springframework.core.io.ClassPathResource;


public class SendEmail {

	static final String FROM = "thomaz@ceasaplus.com.br";  
	static final String SMTP_USERNAME = "thomaz@ceasaplus.com.br";  
	static final String SMTP_PASSWORD = "leghacy123";  
	static final String HOST = "smtp.zoho.com";    
	static final int PORT = 587;


	public void sendMail(String to, String subject, String content ) throws AddressException, MessagingException{

		Properties props = System.getProperties();
		props.put("mail.transport.protocol", "smtps");
		props.put("mail.smtp.port", PORT); 
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.smtp.starttls.required", "true");

		// Create a Session object to represent a mail session with the specified properties. 
		Session session = Session.getDefaultInstance(props);

		// Create a message with the specified information. 
		MimeMessage msg = new MimeMessage(session);
		InternetAddress address =  new InternetAddress(FROM);
		try {
			address.setPersonal("Thomaz - Ceasa Plus","UTF-8");
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		msg.setFrom( address);
		msg.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
		msg.setSubject(subject);
		msg.setContent(content,"text/html;charset=UTF-8");


		// Create a transport.        
		Transport transport = session.getTransport();

		// Send the message.
		try
		{
			System.out.println("Attempting to send an email through the Amazon SES SMTP interface...");

			// Connect to Amazon SES using the SMTP username and password you specified above.
			transport.connect(HOST, SMTP_USERNAME, SMTP_PASSWORD);

			// Send the email.
			transport.sendMessage(msg, msg.getAllRecipients());
			System.out.println("Email sent!");
		}
		catch (Exception ex) {
			System.out.println("The email was not sent.");
			System.out.println("Error message: " + ex.getMessage());
		}
		finally
		{
			// Close and terminate the connection.
			transport.close();        	
		}

	}

	public  StringBuilder getTemplate (String nomeArquivo){

		StringBuilder builder = new 	StringBuilder();

		//Header
		builder.append(lerArquivo("header"));

		//Template
		builder.append(lerArquivo(nomeArquivo));

		//Assinatura de email
		builder.append(lerArquivo("assinatura"));

		return builder;

	}

	public  StringBuilder lerArquivo(String nomeArquivo){

		StringBuilder builder = new 	StringBuilder();

		try{
			BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(new ClassPathResource("email-templates/"+nomeArquivo).getFile()), "UTF-8"));
			while(br.ready()){
				String linha = br.readLine();
				builder.append(linha);
			}
			br.close();
		}catch(IOException ioe){
			ioe.printStackTrace();
		}

		return builder;
	}
}