import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {formatDistanceToNow} from 'date-fns'

type Asset = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string |null;
  thumbnailUrl: string | null;
  isApproved: string;
  userId: string;
  categoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
};


interface AssetGridProps {
    assets:Asset[];
}



function AssetsGrid({assets}:AssetGridProps){
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" >
        {
          assets.map(assets=> (
            <div key={assets?.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow" >
              <div className="h-48 bg-slate-100 relative" >
                <Image 
                 
                  
                 src={assets.fileUrl as string}
                 alt={assets.title}
                 fill
                 className="object-cover"
                />
                <div className="absolute top-2 right-2" >
                  <Badge className={
                      assets.isApproved === 'approved'? 'bg-teal-500':
                      assets.isApproved ===  'rejected'? 'bg-red-500' : 'bg-yellow-500'
                  }  variant={'default'} >
                    {
                      assets.isApproved === 'approved'? 'Aprroved' :
                      assets.isApproved ===  "rejected" ? 'rejected' : 'pending'
                    }
                  </Badge>
                </div>
              </div>
              <div className="p-4" >
                <h3 className="font-medium truncate" >{assets.title}</h3>
                {
                  assets.description && (
                    <p className="text-xs text-slate-500">{assets.description}</p>
                  )
                }
                <div className="flex justify-between items-center mt-3" >
                  <span className="text-xs text-slate-500" >
                     {
                      formatDistanceToNow(new Date(assets.createdAt),{
                         addSuffix:true
                      })
                     }
                  </span>
                </div>
              </div>
            </div>
          ))
        }
    </div>
}

export default AssetsGrid;


