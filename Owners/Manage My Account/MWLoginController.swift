//
//  MWLoginController.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/30/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import FirebaseAuth
import FBSDKCoreKit
import FBSDKLoginKit
import TwitterKit

class OwnerLoginController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var emailLogin: UITextField!
    @IBOutlet weak var passwordLogin: UITextField!
    
  
    
    override func viewDidLoad() {
        super.viewDidLoad()
    
    }


    @IBAction func signIn(_ sender: Any) {
        guard let email = emailLogin.text else {return}
        guard let password = passwordLogin.text else {return}
        
        
        Auth.auth().signIn(withEmail: email, password: password) {user, error in
        
            if error != nil {
                let loginErrorAlert = UIAlertController(title: "Login error", message: "\(String(describing: error?.localizedDescription)) Please try again", preferredStyle: .alert)
                loginErrorAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self.present(loginErrorAlert, animated: true, completion: nil)
                return
            }
          }
      }
    
    @IBAction func forgotPassword(_ sender: Any) {
        let forgotPasswordAlert = UIAlertController(title: "Forgot Password?", message: "Please enter email to retrieve password", preferredStyle: .alert)
        forgotPasswordAlert.addTextField { (textField) in
            textField.placeholder = "Enter your email address"
        }
        forgotPasswordAlert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        forgotPasswordAlert.addAction(UIAlertAction(title: "Reset Password", style: .default, handler: { (action) in
            guard let resetEmail = forgotPasswordAlert.textFields?.first?.text else {return}
            Auth.auth().sendPasswordReset(withEmail: resetEmail, completion: { (error) in
                if error != nil {
                    let resetFailedAlert = UIAlertController(title: "Reset Failed", message: "Error: \(String(describing: error?.localizedDescription))", preferredStyle: .alert)
                    resetFailedAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self.present(resetFailedAlert, animated: true, completion: nil)
                } else {
                    let resetSentAlert = UIAlertController(title: "Reset Email Sent", message: "A password reset email has been sent to your registered email. Please check your email for further instructions", preferredStyle: .alert)
                    resetSentAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self.present(resetSentAlert, animated: true, completion: nil)
                }
            })
        }))
    }
    
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == emailLogin{
            passwordLogin.becomeFirstResponder()
        } else {
            textField.resignFirstResponder()
        }
        return true
    }    
    
    
    @IBAction func signInWithFacebook(_ sender: Any) {
      
    }
    
    func signIntoFirebase() {
      
    }
    
    @IBAction func signInWithTwitter(_ sender: Any) {
      TWTRTwitter.sharedInstance().logIn { (session, error) in
            if error != nil {
                print("Twitter login error: \(String(describing: error?.localizedDescription))")
            } else {
                guard let token = session?.authToken else {return}
                guard let secret = session?.authTokenSecret else {return}
                let credential = TwitterAuthProvider.credential(withToken: token, secret: secret)
                Auth.auth().signInAndRetrieveData(with: credential, completion: { (user, error) in
                    if error != nil {
                        print("Failed to login using Firebase: \(String(describing: error?.localizedDescription))")
                        return
                    }
                    self.performSegue(withIdentifier: "OwnerProfile", sender: self)
                })
            }
        }
    }
    
    
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    

