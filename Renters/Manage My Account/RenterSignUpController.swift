//
//  RenterSignUpController.swift
//  MarysWatch
//
//  Created by Damani Turner on 2/8/19.
//  Copyright © 2019 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase
import FirebaseFirestore

class RenterSignUpController: UIViewController, UITextFieldDelegate {

  @IBOutlet weak var renterCreateAccountFirstName: UITextField!
  @IBOutlet weak var renterCreateAccountLastName: UITextField!
  @IBOutlet weak var renterCreateAccountEmail: UITextField!
  @IBOutlet weak var renterCreateAccountCellPhone: UITextField!
  @IBOutlet weak var renterCreateAccountAddress: UITextField!
  @IBOutlet weak var renterCreateAccountState: UITextField!
  @IBOutlet weak var renterCreateAccountCity: UITextField!
  @IBOutlet weak var renterCreateAccountZip: UITextField!
  @IBOutlet weak var renterCreateAccountCounty: UITextField!
  @IBOutlet weak var renterCreateAccountUsername: UITextField!
  @IBOutlet weak var renterCreateAccountPassword: UITextField!
  @IBOutlet weak var renterCreateAccountConfirmPassword: UITextField!
  
  @IBOutlet weak var renterScrollView: UIScrollView!
  
  
  
  var ref: DocumentReference!
  
  override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        confirgureTapGesture()
        configureTextFields()
    
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillShowNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillHideNotification, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
    }
  
  deinit {
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillShowNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillHideNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
  }
  
  private func confirgureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(RenterSignUpController.handleTap))
    view.addGestureRecognizer(tapGesture)
  }
  
  @objc func handleTap() {
    view.endEditing(true)
  }
  
  @objc func keyboardWillChange(notification: Notification) {
    guard let keyboardRect = (notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? NSValue)?.cgRectValue else {
      return
    }
    
    let keyboardViewEndFrame = view.convert(keyboardRect, to: view.window)
    
    if notification.name == UIResponder.keyboardWillShowNotification || notification.name == UIResponder
      .keyboardWillChangeFrameNotification {
      renterScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
    } else {
      renterScrollView.contentInset = UIEdgeInsets.zero
    }
  }
  
  private func configureTextFields() {
    renterCreateAccountFirstName.delegate = self
    renterCreateAccountLastName.delegate = self
    renterCreateAccountEmail.delegate = self
    renterCreateAccountCellPhone.delegate = self
    renterCreateAccountAddress.delegate = self
    renterCreateAccountState.delegate = self
    renterCreateAccountCity.delegate = self
    renterCreateAccountZip.delegate = self
    renterCreateAccountCounty.delegate = self
    renterCreateAccountUsername.delegate = self
    renterCreateAccountPassword.delegate = self
    renterCreateAccountConfirmPassword.delegate = self
  }
  
  
  @IBAction func signUpRenter(_ sender: Any) {
    guard let email = renterCreateAccountEmail.text, renterCreateAccountEmail.text?.count != 0, isValidEmail(emailID: email) != false  else { let enterValidEmailAlert = UIAlertController(title: "Email is invalid", message: "Please enter a valid email.", preferredStyle: .alert)
      enterValidEmailAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidEmailAlert, animated: true, completion: nil)
      return}
    guard let password = renterCreateAccountPassword.text, renterCreateAccountPassword.text?.count != 0, isPasswordValid(password: password) != false else { let enterValidPasswordAlert = UIAlertController(title: "Password is invalid", message: "Please enter a valid password.", preferredStyle: .alert)
      enterValidPasswordAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidPasswordAlert, animated: true, completion: nil)
      return}
    guard let username = renterCreateAccountUsername.text, renterCreateAccountUsername.text?.count != 0  else { let enterValidUsernameAlert = UIAlertController(title: "Username is invalid", message: "Please enter a valid username with one lowercase letter, one uppercase letter and one number.", preferredStyle: .alert)
      enterValidUsernameAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(enterValidUsernameAlert, animated: true, completion: nil)
      return }
    guard let firstName = renterCreateAccountFirstName.text, renterCreateAccountFirstName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let lastName = renterCreateAccountLastName.text, renterCreateAccountLastName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return  }
    guard let cellPhone = renterCreateAccountCellPhone.text, renterCreateAccountCellPhone.text?.count != 0, isPhoneNumberValid(cellPhone: cellPhone) else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Invalid Phone Number entered", message: "Phone format must follow: ***-***-****", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let address = renterCreateAccountAddress.text, renterCreateAccountAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let state = renterCreateAccountState.text, renterCreateAccountState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let city = renterCreateAccountCity.text, renterCreateAccountCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let zip = renterCreateAccountZip.text, renterCreateAccountZip.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    guard let county = renterCreateAccountCounty.text, renterCreateAccountCounty.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
      fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
      self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
      return }
    
    
    if renterCreateAccountConfirmPassword.text == renterCreateAccountPassword.text {
      
      let renterController = RenterController()
      
      renterController.createNewRenter(email: email, password: password)
      
      renterController.createRenterData(firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: username, password: password)
      
      
      let creationSuccessAlert = UIAlertController(title: "Congratulations! Your account has been setup.", message: "Thank you for setting up an account. Please check your email to verify your account. Login to manage your maintenance process!", preferredStyle: .alert )
      creationSuccessAlert.addAction(UIAlertAction(title: "Login", style: .default, handler: { (action) in
        let storyBoard = UIStoryboard(name: "Main", bundle: nil)
        let popUp = storyBoard.instantiateViewController(withIdentifier: "RenterLoginController")
        self.present(popUp, animated: true, completion: nil)
      }))
      self.present(creationSuccessAlert, animated: true, completion: nil)
    } else {
      let passwordsDontMatchAlert = UIAlertController(title: "Passwords must match", message: "Confirmation password entered does not match the previous one. Please try again", preferredStyle: .alert)
      passwordsDontMatchAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: { (action) in
        self.renterCreateAccountPassword.text = ""
        self.renterCreateAccountConfirmPassword.text = ""
      }))
      self.present(passwordsDontMatchAlert, animated: true, completion: nil)
    }
  }
  
  
  @IBAction func dismissSignupView(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
  func sendVerificationEmail() {
    Auth.auth().currentUser?.sendEmailVerification(completion: { (error) in
      if error != nil {
        print("error sending email: \(String(describing: error?.localizedDescription))")
      } else {
        print("email verification sent")
      }
    })
  }
  

  

}

extension RenterSignUpController {
  
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == renterCreateAccountFirstName {
      renterCreateAccountLastName.becomeFirstResponder()
    } else if textField == renterCreateAccountLastName{
      renterCreateAccountEmail.becomeFirstResponder()
    } else if textField == renterCreateAccountEmail {
      renterCreateAccountCellPhone.becomeFirstResponder()
    } else if textField == renterCreateAccountCellPhone {
      renterCreateAccountAddress.becomeFirstResponder()
    } else if textField == renterCreateAccountAddress {
      renterCreateAccountState.becomeFirstResponder()
    } else if textField == renterCreateAccountState{
      renterCreateAccountCity.becomeFirstResponder()
    } else if textField == renterCreateAccountCity {
      renterCreateAccountZip.becomeFirstResponder()
    } else if textField == renterCreateAccountZip {
      renterCreateAccountCounty.becomeFirstResponder()
    } else if textField == renterCreateAccountCounty {
      renterCreateAccountUsername.becomeFirstResponder()
    } else if textField == renterCreateAccountUsername {
      renterCreateAccountPassword.becomeFirstResponder()
    } else if textField == renterCreateAccountPassword {
      renterCreateAccountConfirmPassword.becomeFirstResponder()
    } else {
      textField.resignFirstResponder()
    }
    return true
  }
  
  func isValidEmail(emailID: String) -> Bool {
    let emailRegEx = "[A-z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
    let emailTest = NSPredicate(format: "SELF MATCHES %@", emailRegEx)
    return emailTest.evaluate(with: emailID)
  }
  
  func isPasswordValid(password: String) -> Bool {
    let passwordRegEx = "^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])[a-zA-z0-9]{8,}"
    let passwordTest = NSPredicate(format: "SELF MATCHES %@", passwordRegEx)
    return passwordTest.evaluate(with: password)
  }
  
  
  func isPhoneNumberValid(cellPhone: String) -> Bool {
    let cellPhoneRegEx = "^\\d{3}-\\d{3}-\\d{4}$"
    let cellPhoneTest = NSPredicate(format: "SELF MATCHES %@", cellPhoneRegEx)
    return cellPhoneTest.evaluate(with:cellPhone)
  }
}
