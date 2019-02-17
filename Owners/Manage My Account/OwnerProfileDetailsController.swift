//
//  OwnerProfileDetailsController.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/5/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase
import FirebaseStorage

class OwnerProfileDetailsController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    @IBOutlet weak var ownerDisplayNameField: UILabel!
    @IBOutlet weak var ownerDisplayPhoneField: UILabel!
    @IBOutlet weak var ownerDisplayEmailField: UILabel!
    @IBOutlet weak var ownerDisplayAddressField: UILabel!
    @IBOutlet weak var ownerTypeOfUser: UILabel!
    @IBOutlet weak var ownerManageMyAccountView: UIView!
    @IBOutlet weak var showManageMyAccount: UIButton!
  
    @IBOutlet weak var profileImage: UIImageView!
    var docReference: DocumentReference!
    var nameListener: ListenerRegistration!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        docReference = Firestore.firestore().collection("User").document("Owner")
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        nameListener = docReference.addSnapshotListener { (docSnapshot, error) in
            guard let docSnapshot = docSnapshot, docSnapshot.exists else {return}
          guard let profileData = docSnapshot.data() else {
            print("Owner data is empty")
            return
          }
          guard let firstName = profileData["First Name"] as? String else {return}
          guard let lastName = profileData["Last Name"] as? String else {return}
            let ownerName = "\(firstName) \(lastName)"
          guard let currentAddress = profileData["address"] as? String else {return}
          guard let currentCity = profileData["City"] as? String else {return}
          guard let currentState = profileData["State"] as? String else {return}
          guard let currentZipcode = profileData["Zipcode"] as? String else {return}
            let fullAddress = "\(currentAddress) \(currentCity) \(currentState), \(currentZipcode)"
          guard let email = profileData["Email"] as? String else {return}
          guard let phoneNumber = profileData["Cell Phone"] as? String else {return}
          
            self.ownerDisplayNameField.text = ownerName
            self.ownerDisplayAddressField.text = fullAddress
            self.ownerDisplayEmailField.text = email
            self.ownerDisplayPhoneField.text = phoneNumber
            self.ownerTypeOfUser.text = "Owner"
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        nameListener.remove()
    }
  
  @IBAction func closeManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = true
  }
  
  @IBAction func dismissManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = true
  }
  
  @IBAction func showManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = true
  }
  
    @IBAction func changeProfileImage(_ sender: Any) {
        
        guard let image = profileImage.image else { return }
        
        let imagePickerController = UIImagePickerController()
        imagePickerController.delegate = self
        
        let actionSheet = UIAlertController(title: "Photo Source", message: "Choose image source", preferredStyle: .actionSheet)
        
        actionSheet.addAction(UIAlertAction(title: "Camera", style: .default, handler: { (action: UIAlertAction) in
            
            if UIImagePickerController.isSourceTypeAvailable(.camera) {
                imagePickerController.sourceType = .camera
                self.present(imagePickerController, animated: true, completion: nil)
            } else {
                print("Camera is not available")
            }
            
            
        }))
        actionSheet.addAction(UIAlertAction(title: "Photo Library", style: .default, handler: { (action: UIAlertAction) in
            imagePickerController.sourceType = .photoLibrary
            self.present(imagePickerController, animated: true, completion: nil)
        }))
        actionSheet.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        
        self.present(actionSheet, animated: true, completion: nil)
      
      
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
// Local variable inserted by Swift 4.2 migrator.
let info = convertFromUIImagePickerControllerInfoKeyDictionary(info)

        let image = info[convertFromUIImagePickerControllerInfoKey(UIImagePickerController.InfoKey.originalImage)] as! UIImage
        
        profileImage.image = image
        
        picker.dismiss(animated: true, completion: nil)
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true, completion: nil)
    }
    
    
  var imageReference: StorageReference {
    return Storage.storage().reference().child("images")
  }
  
  
    
  
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  
}

// Helper function inserted by Swift 4.2 migrator.
fileprivate func convertFromUIImagePickerControllerInfoKeyDictionary(_ input: [UIImagePickerController.InfoKey: Any]) -> [String: Any] {
	return Dictionary(uniqueKeysWithValues: input.map {key, value in (key.rawValue, value)})
}

// Helper function inserted by Swift 4.2 migrator.
fileprivate func convertFromUIImagePickerControllerInfoKey(_ input: UIImagePickerController.InfoKey) -> String {
	return input.rawValue
}
