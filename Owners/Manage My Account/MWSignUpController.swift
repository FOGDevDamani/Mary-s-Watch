//
//  MWSignUpController.swift
//  MarysWatch
//
//  Created by Damani Turner on 9/6/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import FirebaseAuth

class MWSignUpController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var emailTF: UITextField!
    @IBOutlet weak var passwordTF: UITextField!
    @IBOutlet weak var reenterPasswordTF: UITextField!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    @IBAction func signUp(_ sender: Any) {
        guard let email = emailTF.text else {return}
        guard let password = passwordTF.text else {return}
        
        if reenterPasswordTF.text == passwordTF.text {
            Auth.auth().createUser(withEmail: email, password: password) {user, error in
        
                if error != nil {
                    let signupErrorAlert = UIAlertController(title: "Signup Error", message: "\(error?.localizedDescription)", preferredStyle: .alert)
                    signupErrorAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self.present(signupErrorAlert, animated: true, completion: nil)
                    return
                }
                self.sendEmail()
                self.dismiss(animated: true, completion: nil)
            }
        } else {
            let passwordsDontMatchAlert = UIAlertController(title: "Oops", message: "Your passwords do not match. Please try again", preferredStyle: .alert)
            passwordsDontMatchAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
                self.passwordTF.text = ""
                self.reenterPasswordTF.text = ""
            }))
            self.present(passwordsDontMatchAlert, animated: true, completion: nil)
        }
    }
    
    func sendEmail() {
        guard let email = emailTF.text else{return}
        guard let password = passwordTF.text else {return}
        Auth.auth().signIn(withEmail: email, password: password) { (user, error) in
            if error != nil {
                print("Error: \(String(describing: error?.localizedDescription))")
                return
            }
            Auth.auth().currentUser?.sendEmailVerification(completion: { (error) in
                if error != nil {
                    let emailNotSentAlert = UIAlertController(title: "Email Verification", message: "Verificationemail failed to send: \(error?.localizedDescription)", preferredStyle: .alert)
                    emailNotSentAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self.present(emailNotSentAlert, animated: true, completion: nil)
                } else {
                    let emailSentAlert = UIAlertController(title: "Email Verification", message: "Email verification sent. Please verify email.", preferredStyle: .alert)
                    emailSentAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self.present(emailSentAlert, animated: true, completion: {
                        self.dismiss(animated: true, completion: nil)
                    })
                }
                do {
                    try Auth.auth().signOut()
                } catch {
                    
                }
            })
        }
    }
    
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == emailTF {
            passwordTF.becomeFirstResponder()
        } else if textField == passwordTF{
            reenterPasswordTF.becomeFirstResponder()
        } else {
            textField.resignFirstResponder()
        }
        return true
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

}
