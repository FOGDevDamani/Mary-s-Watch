//
//  SPLoginController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/9/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase
import FacebookLogin
import FacebookCore
import TwitterKit

class SPLoginController: UIViewController, UITextFieldDelegate {

  @IBOutlet weak var spEmailLogin: UITextField!
  @IBOutlet weak var spPasswordLogin: UITextField!
  
  
  override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    configureTextFields()
    configureTapGesture()
    }
    
  @IBAction func signIn(_ sender: Any) {
    guard let email = spEmailLogin.text else {return}
    guard let password = spPasswordLogin.text else {return}
    
    
    Auth.auth().signIn(withEmail: email, password: password) {user, error in
      
      if error != nil {
        let loginErrorAlert = UIAlertController(title: "Login error", message: "\(String(describing: error?.localizedDescription)) Please try again", preferredStyle: .alert)
        loginErrorAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(loginErrorAlert, animated: true, completion: nil)
        return
      } else {
        let storyboard = UIStoryboard(name: "SPProfile", bundle: nil)
        let popUp = storyboard.instantiateViewController(withIdentifier: "SPProfileController")
        self.present(popUp, animated: true, completion: nil)
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
  
  private func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(SPLoginController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  private func configureTextFields() {
    spEmailLogin.delegate = self 
    spPasswordLogin.delegate = self
  }
  
  
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == spEmailLogin{
      spPasswordLogin.becomeFirstResponder()
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
        print("logged into facebook")
        self.signIntoFirebase()
      case .failed(let err):
        print(err)
      case .cancelled:
        print("cancelled")
      }
      
    }
  }
  
  func signIntoFirebase() {
    guard let accessTokenString = AccessToken.current?.authenticationToken else { return }
    let credential = FacebookAuthProvider.credential(withAccessToken: accessTokenString)
    Auth.auth().signInAndRetrieveData(with: credential) { (user, error) in
      if let error = error {
        print(error)
        return
      }
      print("logged into firebase")
    }
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
