//
//  OwnersCustomerDisplayController.swift
//  maryswatch
//
//  Created by Damani Turner on 6/30/18.
//  Copyright © 2018 FOGDev Studios. All rights reserved.
//

import UIKit


class OwnersCustomerDisplayController: UIViewController  {
    
    
    @IBOutlet weak var ownerCustomerView: UICollectionView!
    
 


    override func viewDidLoad() {
        super.viewDidLoad()

        fetchData()
        ownerCustomerView.reloadData()
    }

    
    
    
    func fetchData() {
        
    }

}
