import { useState } from "react";
import { Image } from "react-native";

// Importações dos componentes Gluestack (Caminhos locais criados pelo CLI)
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EyeIcon, EyeOffIcon } from "lucide-react-native"; // Gluestack usa Lucide

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => !showState);
  };

  return (
    <Box className="flex-1 bg-white px-4">
      <Center className="flex-1">
        
        {/* Logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={{width: 160, height:160}}
        />

        {/* Títulos */}
        <VStack space="xs" className="mb-8 items-center">
          <Heading size="2xl" className="text-gray-900">
            TruckFlow
          </Heading>
          <Text size="md" className="text-gray-500">
            Login do Motorista
          </Text>
        </VStack>

        {/* Card do Formulário */}
        <Card size="md" variant="elevated" className="w-full max-w-[400px] p-6 m-2 bg-white rounded-xl">
          <VStack space="xl">
            
            {/* Campo Email */}
            <VStack space="xs">
              <Text size="sm" className="font-medium text-gray-900">Email</Text>
              <Input variant="outline" size="md" className="rounded-lg border-gray-300 focus:border-blue-600">
                <InputField 
                  placeholder="seu@email.com" 
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
            </VStack>

            <VStack space="xs">
              <Text size="sm" className="font-medium text-gray-900">Senha</Text>
              <Input variant="outline" size="md" className="rounded-lg border-gray-300 focus:border-blue-600">
                <InputField 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                />
                <InputSlot className="pr-3" onPress={handleState}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} className="text-gray-500"/>
                </InputSlot>
              </Input>
            </VStack>

            <Button 
              size="lg" 
              className="w-full bg-blue-600 rounded-lg mt-2 active:bg-blue-700"
              onPress={() => console.log("Login:", email)}
            >
              <ButtonText className="font-bold">ENTRAR</ButtonText>
            </Button>

            {/* Link Esqueci Senha */}
            <Button variant="link" size="sm" className="mt-2">
              <ButtonText className="text-gray-500 underline">Esqueci minha senha</ButtonText>
            </Button>

          </VStack>
        </Card>

      </Center>
    </Box>
  );
}