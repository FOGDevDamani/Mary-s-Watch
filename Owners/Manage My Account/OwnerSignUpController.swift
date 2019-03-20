//
//  OwnerSignUpController.swift
//  MarysWatch
//
//  Created by Damani Turner on 9/6/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase
import FirebaseFirestore

class OwnerSignUpController: UIViewController, UITextFieldDelegate {

  @IBOutlet weak var ownerCreateAccountTypeOfOwner: UITextField!
  @IBOutlet weak var ownerCreateAccountFirstName: UITextField!
  @IBOutlet weak var ownerCreateAccountLastName: UITextField!
  @IBOutlet weak var ownerCreateAccountEmail: UITextField!
  @IBOutlet weak var ownerCreateAccountAddress: UITextField!
  @IBOutlet weak var ownerCreateAccountCellPhone: UITextField!
  @IBOutlet weak var ownerCreateAccountState: UITextField!
  @IBOutlet weak var ownerCreateAccountCity: UITextField!
  @IBOutlet weak var ownerCreateAccountZip: UITextField!
  @IBOutlet weak var ownerCreateAccountCounty: UITextField!
  @IBOutlet weak var ownerCreateAccountUsername: UITextField!
  @IBOutlet weak var ownerCreateAccountPassword: UITextField!
  @IBOutlet weak var ownerCreateAccountConfirmPassword: UITextField!
  
  @IBOutlet weak var ownerScrollView: UIScrollView!
  
  var selectedState: String?
  var ownerController = MWOwnerController()
  
 let states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
  
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        configureTextFields()
        configureTapGesture()
        createToolBar()
        createStatePicker()
      NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillShowNotification, object: nil)
      NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillHideNotification, object: nil)
      NotificationCenter.default.addObserver(self, selector: #selector(keyboardWillChange(notification:)), name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
    }
  
  deinit {
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillShowNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillHideNotification, object: nil)
    NotificationCenter.default.removeObserver(self, name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
  }
  
  func createStatePicker() {
    let statePicker = UIPickerView()
    statePicker.delegate = self
    
    ownerCreateAccountState.inputView = statePicker
    
  }
  
  func createToolBar() {
    let toolBar = UIToolbar()
    toolBar.sizeToFit()
    
    let doneButton = UIBarButtonItem(title: "Done", style: .plain, target: self, action: #selector(OwnerSignUpController.handleTap))
    
    toolBar.setItems([doneButton], animated: false)
    toolBar.isUserInteractionEnabled = true
    
    ownerCreateAccountState.inputAccessoryView = toolBar
  }
  
  private func configureTapGesture() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(OwnerSignUpController.handleTap))
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
      ownerScrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: keyboardViewEndFrame.height, right: 0)
    } else {
      ownerScrollView.contentInset = UIEdgeInsets.zero
    }
  }
  
  private func configureTextFields() {
    ownerCreateAccountTypeOfOwner.delegate = self
    ownerCreateAccountFirstName.delegate = self
    ownerCreateAccountLastName.delegate = self
    ownerCreateAccountEmail.delegate = self
    ownerCreateAccountAddress.delegate = self
    ownerCreateAccountCellPhone.delegate = self
    ownerCreateAccountState.delegate = self
    ownerCreateAccountCity.delegate = self
    ownerCreateAccountZip.delegate = self
    ownerCreateAccountCounty.delegate = self
    ownerCreateAccountUsername.delegate = self
    ownerCreateAccountPassword.delegate = self
    ownerCreateAccountConfirmPassword.delegate = self
  }
  

    @IBAction func signUp(_ sender: Any) {
        guard let email = ownerCreateAccountEmail.text, ownerCreateAccountEmail.text?.count != 0, isValidEmail(emailID: email) != false  else { let enterValidEmailAlert = UIAlertController(title: "Email is invalid", message: "Please enter a valid email.", preferredStyle: .alert)
          enterValidEmailAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
          self.present(enterValidEmailAlert, animated: true, completion: nil)
          return}
        guard let password = ownerCreateAccountPassword.text, ownerCreateAccountPassword.text?.count != 0, isPasswordValid(password: password) != false else { let enterValidPasswordAlert = UIAlertController(title: "Password is invalid", message: "Please enter a valid password.", preferredStyle: .alert)
          enterValidPasswordAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
          self.present(enterValidPasswordAlert, animated: true, completion: nil)
          return}
        guard let username = ownerCreateAccountUsername.text, ownerCreateAccountUsername.text?.count != 0  else { let enterValidUsernameAlert = UIAlertController(title: "Username is invalid", message: "Please enter a valid username with one lowercase letter, one uppercase letter and one number.", preferredStyle: .alert)
          enterValidUsernameAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
          self.present(enterValidUsernameAlert, animated: true, completion: nil)
          return }
        guard let typeOfOwner = ownerCreateAccountTypeOfOwner.text, ownerCreateAccountTypeOfOwner.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
          fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
          self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          return }
      guard let firstName = ownerCreateAccountFirstName.text, ownerCreateAccountFirstName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          return }
      guard let lastName = ownerCreateAccountLastName.text, ownerCreateAccountLastName.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          return  }
      guard let cellPhone = ownerCreateAccountCellPhone.text, ownerCreateAccountCellPhone.text?.count != 0, isPhoneNumberValid(cellPhone: cellPhone) else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Invalid Phone Number entered", message: "Phone format must follow: ***-***-****", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          return }
      guard let address = ownerCreateAccountAddress.text, ownerCreateAccountAddress.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          return }
      guard let state = ownerCreateAccountState.text, ownerCreateAccountState.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          return }
      guard let city = ownerCreateAccountCity.text, ownerCreateAccountCity.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          return }
      guard let zip = ownerCreateAccountZip.text, ownerCreateAccountZip.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          return }
      guard let county = ownerCreateAccountCounty.text, ownerCreateAccountCounty.text?.count != 0 else { let fieldMustNotBeEmptyAlert = UIAlertController(title: "Cannot skip field", message: "This field must not be left empty", preferredStyle: .alert)
        fieldMustNotBeEmptyAlert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        self.present(fieldMustNotBeEmptyAlert, animated: true, completion: nil)
          return }
      
      
        if ownerCreateAccountConfirmPassword.text == ownerCreateAccountPassword.text {
          
          ownerController.createNewOwner(email: email, password: password)
          
          ownerController.createOwnerData(typeOfOwner: typeOfOwner, firstName: firstName, lastName: lastName, email: email, cellPhone: cellPhone, address: address, state: state, city: city, zip: zip, county: county, userName: username, password: password)
          
         showAlert(title: "Congratulations! Your account has been setup." , message: "Thank you for setting up an account. Please check your email to verify your account. Login to manage your maintenance process!", style: .alert, handler: proceedToOwnerLogin)
        } else {
           showAlert(title: "Passwords must match", message: "Confirmation password entered does not match the previous one. Please try again", style: .alert, handler: emptyFields)
        }
  
    }
  
  
  @IBAction func dismissSignupVIew(_ sender: Any) {
    self.dismiss(animated: true, completion: nil)
  }
  
  
}

extension OwnerSignUpController: UIPickerViewDataSource, UIPickerViewDelegate {
  
  func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    if textField == ownerCreateAccountTypeOfOwner {
      ownerCreateAccountFirstName.becomeFirstResponder()
    } else if textField == ownerCreateAccountFirstName{
      ownerCreateAccountLastName.becomeFirstResponder()
    } else if textField == ownerCreateAccountLastName {
      ownerCreateAccountEmail.becomeFirstResponder()
    } else if textField == ownerCreateAccountEmail {
      ownerCreateAccountCellPhone.becomeFirstResponder()
    } else if textField == ownerCreateAccountCellPhone {
      ownerCreateAccountAddress.becomeFirstResponder()
    } else if textField == ownerCreateAccountAddress {
      ownerCreateAccountState.becomeFirstResponder()
    } else if textField == ownerCreateAccountState {
      ownerCreateAccountCity.becomeFirstResponder()
    } else if textField == ownerCreateAccountCity {
      ownerCreateAccountZip.becomeFirstResponder()
    } else if textField == ownerCreateAccountZip {
      ownerCreateAccountCounty.becomeFirstResponder()
    } else if textField == ownerCreateAccountCounty {
      ownerCreateAccountUsername.becomeFirstResponder()
    } else if textField == ownerCreateAccountUsername {
      ownerCreateAccountPassword.becomeFirstResponder()
    } else if textField == ownerCreateAccountPassword {
      ownerCreateAccountConfirmPassword.becomeFirstResponder()
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
  
  func numberOfComponents(in pickerView: UIPickerView) -> Int {
    return 1
  }
  
  func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
    return states.count
  }
  
  func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
    return states[row]
  }
  
  func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
    selectedState = states[row]
    ownerCreateAccountState.text = selectedState
  }
  
  func showAlert(title: String, message: String, style: UIAlertController.Style = .alert, handler: ((UIAlertAction) -> Void)?) {
    let alertController = UIAlertController(title: title, message: message, preferredStyle: style)
    let okAction = UIAlertAction(title: "OK", style: .default, handler: handler)
    alertController.addAction(okAction)
    
    present(alertController, animated: true, completion: nil)
  }
  
  func proceedToOwnerLogin(sender: UIAlertAction) -> Void {
    let storyBoard = UIStoryboard(name: "Main", bundle: nil)
    let popUp = storyBoard.instantiateViewController(withIdentifier: "OwnerLoginController")
    self.present(popUp, animated: true, completion: nil)
  }
  
  func emptyFields(sender: UIAlertAction) -> Void {
    self.ownerCreateAccountPassword.text = ""
    self.ownerCreateAccountConfirmPassword.text = ""
  }
  
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    


