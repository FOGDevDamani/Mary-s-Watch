//
//  MWLoginController.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/30/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase
import TwitterKit
import FBSDKLoginKit


class OwnerLoginController: UIViewController, UITextFieldDelegate, FBSDKLoginButtonDelegate {
    
    @IBOutlet weak var emailLogin: UITextField!
    @IBOutlet weak var passwordLogin: UITextField!
  
  @IBOutlet weak var ownerFBLogin: FBSDKLoginButton!
  
  let ownerController = OwnerController()
  
    
    override func viewDidLoad() {
        super.viewDidLoad()
      configureTapGesture()
      configureTextFields()
      
      ownerFBLogin.readPermissions = ["email"]
    
    }


    @IBAction func signIn(_ sender: Any) {
        guard let email = emailLogin.text else {return}
        guard let password = passwordLogin.text else {return}
        
      ownerController.loginOwner(email: email, password: password)
      
      if Auth.auth().currentUser?.isEmailVerified == false {
        ownerController.sendVerificationEmail()
      }
      }
    
    @IBAction func forgotOwnerPassword(_ sender: Any) {
      guard let email = emailLogin.text else {return}
      
      ownerController.ownerForgotPassword(withEmail: email)
      
        }
  
  private func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(OwnerLoginController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  private func configureTextFields() {
    emailLogin.delegate = self
    passwordLogin.delegate = self
  }
    
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        if textField == emailLogin{
            passwordLogin.becomeFirstResponder()
        } else {
            textField.resignFirstResponder()
        }
        return true
    }    
    
    
  func loginButton(_ loginButton: FBSDKLoginButton!, didCompleteWith result: FBSDKLoginManagerLoginResult!, error: Error!) {
    if error == nil {
      let credential = FacebookAuthProvider.credential(withAccessToken: (FBSDKAccessToken.current()?.tokenString)!)
      Auth.auth().signInAndRetrieveData(with: credential) { (authResutlt, error) in
        if let error = error {
          print(error.localizedDescription)
          return
        }
        print(authResutlt?.user.email as Any)
        let storyboard = UIStoryboard(name: "OwnerProfile", bundle: nil)
        let popUp = storyboard.instantiateViewController(withIdentifier: "OwnerProfileController")
        self.present(popUp, animated: true, completion: nil)
      }
      
    } else {
      print("\(error.localizedDescription)")
    }
  }
  
  func loginButtonDidLogOut(_ loginButton: FBSDKLoginButton!) {
    print("User logged out")
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
                  let storyboard = UIStoryboard(name: "OwnerProfile", bundle: nil)
                  let popUp = storyboard.instantiateViewController(withIdentifier: "OwnerProfileController")
                  self.present(popUp, animated: true, completion: nil)
                })
            }
        }
    }
    
    
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    

