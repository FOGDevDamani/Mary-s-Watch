//
//  OwnerProfileDetailsController.swift
//  MarysWatch
//
//  Created by Damani Turner on 8/5/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import FirebaseFirestore
import FirebaseStorage
import FirebaseAuth

class OwnerProfileDetailsController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {

    @IBOutlet weak var ownerDisplayNameField: UILabel!
    @IBOutlet weak var ownerDisplayPhoneField: UILabel!
    @IBOutlet weak var ownerDisplayEmailField: UILabel!
    @IBOutlet weak var ownerDisplayAddressField: UILabel!
  
    @IBOutlet weak var profileImage: UIImageView!
    var reference: DocumentReference!
    var nameListener: ListenerRegistration!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        reference = Firestore.firestore().document("User/qYddEMg9j2PxaxKocb3D")
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        nameListener = reference.addSnapshotListener { (docSnapshot, error) in
            guard let docSnapshot = docSnapshot, docSnapshot.exists else {return}
            let profileData = docSnapshot.data()
            let firstName = profileData["firstName"] as? String ?? ""
            let lastName = profileData["lastName"] as? String ?? ""
            let currentName = "\(firstName) \(lastName)"
            let currentAddress = profileData["address"] as? String ?? ""
            let currentCity = profileData["city"] as? String ?? ""
            let currentState = profileData["state"] as? String ?? ""
            let currentZipcode = profileData["zipCode"] as? String ?? ""
            let fullAddress = "\(currentAddress) \(currentCity) \(currentState), \(currentZipcode)"
            let email = profileData["email"] as? String ?? ""
            let phoneNumber = profileData["cellPhone"] as? String ?? ""
            self.ownerDisplayNameField.text = currentName
            self.ownerDisplayAddressField.text = fullAddress
            self.ownerDisplayEmailField.text = email
            self.ownerDisplayPhoneField.text = phoneNumber
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        nameListener.remove()
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
        
        self.uploadProfileImage(image) {url in
            let changeRequest = Auth.auth().currentUser?.createProfileChangeRequest()
            changeRequest?.photoURL = url
            
            changeRequest?.commitChanges {error in
                if error == nil {
                    print("photo changed")
                } else {
                    print("Error: \(error!.localizedDescription)")
                }
            }
        }
    }
    
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        let image = info[UIImagePickerControllerOriginalImage] as! UIImage
        
        profileImage.image = image
        
        picker.dismiss(animated: true, completion: nil)
    }
    
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true, completion: nil)
    }
    
    func uploadProfileImage(_ image:UIImage, completion: @escaping ((_ url:URL?)->())) {
        guard let uid = Auth.auth().currentUser?.uid else { return }
        let storageRef = Storage.storage().reference().child("user/\(uid)")
        
        guard let imageData = UIImageJPEGRepresentation(image, 0.75) else { return }
        
        let metaData = StorageMetadata()
        metaData.contentType = "image/jpg"
        storageRef.putData(imageData, metadata: metaData) {metaData, error in
            if error == nil,metaData == nil  {
                if let url = metaData?.downloadURL() {
                    completion(url)
                } else {
                    completion(nil)
                }
            } else {
                completion(nil)
            }
        }
    }
    
    
    
  
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
  
}
