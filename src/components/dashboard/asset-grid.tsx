

type Asset = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
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
    return <div>
        
    </div>
}

export default AssetsGrid;


