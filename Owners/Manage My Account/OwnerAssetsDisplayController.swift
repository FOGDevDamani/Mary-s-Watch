//
//  OwnerAssetsDisplayController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/30/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit


class OwnerAssetsDisplayController: UIViewController {
    
    @IBOutlet weak var ownerAssetsView: UICollectionView!
    
   

    override func viewDidLoad() {
        super.viewDidLoad()

        fetchData()
        ownerAssetsView.reloadData()
    }
    
   
    
    func fetchData() {
    
    }

    
}
