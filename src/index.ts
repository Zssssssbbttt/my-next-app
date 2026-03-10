// 电脑接口

interface ComputerSpecs {
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
  motherboard: string;
  hasBluetooth: boolean;
  hasWifi: boolean;
  hasLiquidCooling?: boolean;
  hasRGBLighting?: boolean;
}

// 电脑类
class Computer {
  private specs: ComputerSpecs;

  // 私有构造函数
  private constructor(builder: any) {
    this.specs = builder.getSpecs();
  }

  // 获取配置信息
  getSpecs(): ComputerSpecs {
    return { ...this.specs }; // 返回副本以保持不可变性
  }

  // 显示配置
  display(): string {
    return `
计算机配置:
- CPU: ${this.specs.cpu}
- 内存: ${this.specs.ram}
- 存储: ${this.specs.storage}
- 显卡: ${this.specs.gpu}
- 主板: ${this.specs.motherboard}
- 蓝牙: ${this.specs.hasBluetooth ? '有' : '无'}
- WiFi: ${this.specs.hasWifi ? '有' : '无'}
- 水冷: ${this.specs.hasLiquidCooling ? '有' : '无'}
- RGB灯光: ${this.specs.hasRGBLighting ? '有' : '无'}
        `.trim();
  }

  // Builder类
  static Builder = class ComputerBuilder {
    private specs: ComputerSpecs;

    constructor(cpu: string, ram: string) {
      this.specs = {
        cpu,
        ram,
        storage: "512GB SSD",
        gpu: "集成显卡",
        motherboard: "标准主板",
        hasBluetooth: false,
        hasWifi: false
      };
    }

    storage(storage: string): ComputerBuilder {
      this.specs.storage = storage;
      return this;
    }

    gpu(gpu: string): ComputerBuilder {
      this.specs.gpu = gpu;
      return this;
    }

    motherboard(motherboard: string): ComputerBuilder {
      this.specs.motherboard = motherboard;
      return this;
    }

    hasBluetooth(hasBluetooth: boolean): ComputerBuilder {
      this.specs.hasBluetooth = hasBluetooth;
      return this;
    }

    hasWifi(hasWifi: boolean): ComputerBuilder {
      this.specs.hasWifi = hasWifi;
      return this;
    }

    hasLiquidCooling(hasLiquidCooling: boolean): ComputerBuilder {
      this.specs.hasLiquidCooling = hasLiquidCooling;
      return this;
    }

    hasRGBLighting(hasRGBLighting: boolean): ComputerBuilder {
      this.specs.hasRGBLighting = hasRGBLighting;
      return this;
    }

    private getSpecs(): ComputerSpecs {
      return { ...this.specs };
    }

    build(): Computer {
      return new Computer(this);
    }
  }
}




// 使用静态内部类Builder
function demonstrateStaticBuilder(): void {
  console.log("=== 静态内部类Builder模式 ===");

  // 构建游戏电脑
  const gamingPC = new Computer.Builder("Intel i9-13900K", "32GB DDR5")
    .storage("2TB NVMe SSD")
    .gpu("NVIDIA RTX 4090")
    .motherboard("ROG STRIX Z790-E")
    .hasBluetooth(true)
    .hasWifi(true)
    .hasLiquidCooling(true)
    .hasRGBLighting(true)
    .build();

  console.log(gamingPC.display());

  // 构建办公电脑
  const officePC = new Computer.Builder("Intel i5-13400F", "16GB DDR4")
    .storage("1TB SSD")
    .hasWifi(true)
    .build();

  console.log(officePC.display());
}




interface PhoneSpecs{
  name:string;
  color:string;
  size:string;
  hasLight:boolean;
  hasWifi:boolean;
  hasBluetooth:boolean;
  gpu:string;
}

class Phone{
  private specs:PhoneSpecs

  private constructor(builder:any) {
    this.specs = builder.getSpecs()
  }

  getSpecs():PhoneSpecs{
    return {...this.specs}
  }

  display():string{
    return `计算机配置:
    -颜色:${this.specs.color}
    -大小:${this.specs.size}
    -是否有灯:${this.specs.hasLight}
    -是否有WIFI:${this.specs.hasWifi}
    -是否有蓝牙:${this.specs.hasBluetooth}
    -GPU:${this.specs.gpu}`
  }

  static Builder = class PhoneBulder{
    private specs:PhoneSpecs

    constructor(name:string,color:string) {
      this.specs={
        name,
        color,
        size:'6.5英寸',
        hasLight:false,
        hasWifi:false,
        hasBluetooth:false,
        gpu:'360核',
      }


    }


    getSpecs(){
      return {...this.specs}
    }

    build(){
      return new Phone(this)
    }
  }
}