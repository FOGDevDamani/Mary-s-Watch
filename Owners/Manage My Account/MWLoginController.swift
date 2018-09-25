//
//  MWLoginController.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/30/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import FirebaseAuth
import FacebookCore
import FacebookLogin

class MWLoginController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var emailLogin: UITextField!
    @IBOutlet weak var passwordLogin: UITextField!
    
    var userID = Auth.auth().currentUser?.uid
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
    
    }
    
//    override func viewDidAppear(_ animated: Bool) {
//        super.viewDidAppear(animated)
//
//        if let user = Auth.auth().currentUser {
//            self.performSegue(withIdentifier: "OwnerProfile", sender: self)
//        }
//    }

    @IBAction func signIn(_ sender: Any) {
        guard let email = emailLogin.text else {return}
        guard let password = passwordLogin.text else {return}
        
        
        Auth.auth().signIn(withEmail: email, password: password) {user, error in
        
            if error != nil {
                let loginErrorAlert = UIAlertController(title: "Login error", message: "\(error?.localizedDescription) Please try again", preferredStyle: .alert)
                loginErrorAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self.present(loginErrorAlert, animated: true, completion: nil)
                return
            }
            
            if user!.isEmailVerified {
                self.performSegue(withIdentifier: "OwnerProfile", sender: self)
            } else {
                let notVerifiedAlert = UIAlertController(title: "Not verified", message: "Your account is pending verification. Please check your email and verify your account", preferredStyle: .alert)
                notVerifiedAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                self.present(notVerifiedAlert, animated: true, completion: nil)
                do {
                    try Auth.auth().signOut()
                } catch {
                    
                }
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
                    let resetFailedAlert = UIAlertController(title: "Reset Failed", message: "Error: \(error?.localizedDescription)", preferredStyle: .alert)
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
        let loginManager = LoginManager()
        loginManager.logIn(readPermissions: [.publicProfile, .email], viewController: self) { (result) in
            switch result {
            case .success(grantedPermissions: _, declinedPermissions: _, token: _):
                self.signIntoFirebase()
            case .failed(let err):
                print(err)
            case .cancelled:
                print("cancelled")
            }
        }
    }
    
    func signIntoFirebase() {
        guard let authenticationTokenString = AccessToken.current?.authenticationToken else {return}
        let credential = FacebookAuthProvider.credential(withAccessToken: authenticationTokenString)
        Auth.auth().signIn(with: credential) { (user, err) in
            if let err = err {
                print(err)
                return
            }
            print("Logged in with Facebook")
        }
    }
    
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    

