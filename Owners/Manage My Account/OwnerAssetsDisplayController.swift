//
//  OwnerAssetsDisplayController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/30/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit
import Firebase

class OwnerAssetsDisplayController: UIViewController, UICollectionViewDelegate, UICollectionViewDataSource {
  
  var ownerAssetReference: CollectionReference!
  var ownerAssetArray = [OwnerAssets]()
    
    @IBOutlet weak var ownerAssetsView: UICollectionView!
  @IBOutlet weak var ownerManageMyAccountView: UIView!
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
  }

    override func viewDidLoad() {
        super.viewDidLoad()
      ownerAssetReference = Firestore.firestore().collection("User").document("Owner").collection("MyAssets")
    }
  
  func loadOwnerAssetData() {
    ownerAssetReference.addSnapshotListener { (snapshot, error) in
      if error != nil {
        print("\(String(describing: error?.localizedDescription))")
        return
      } else {
        guard let snapshot = snapshot else {return}
        let ownerAssetData = snapshot.documents.compactMap({OwnerAssets(dictionary: $0.data())})
        self.ownerAssetArray = ownerAssetData
        DispatchQueue.main.async {
          self.ownerAssetsView.reloadData()
        }
      }
    }
  }
  
  func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
    return ownerAssetArray.count
  }
  
  func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
    let identifier = "OwnerAssetsViewCell"
    let cell = collectionView.dequeueReusableCell(withReuseIdentifier: identifier, for: indexPath) as! OwnerAssetsViewCell
    
    let ownerAsset = ownerAssetArray[indexPath.item]
    let assetAddress = "\(ownerAsset.typeOfProperty) \(ownerAsset.address) \(ownerAsset.city), \(ownerAsset.state)"
    let assetTitle = assetAddress
    
    cell.ownerAssetAddressAndType.titleLabel?.text = assetTitle
    
    return cell
  }
    
  @IBAction func showManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = false
  }
  @IBAction func closeManageMyAccount(_ sender: Any) {
    ownerManageMyAccountView.isHidden = true
  }
  @IBAction func dismissManageMyAccountView(_ sender: Any) {
    ownerManageMyAccountView.isHidden = true
  }
  
  
  
    
  

    
}
